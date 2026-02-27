import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ProfileData, AllProfileData, Sale, PendingInvestment, Fee } from '../lib/types';

interface AppContextProps {
    activeProfileId: string;
    setActiveProfileId: (id: string) => void;
    allProfileData: AllProfileData;
    profileData: ProfileData | undefined;
    dailyRegistrationName: string;
    setDailyRegistrationName: (name: string) => void;

    // Period Filter
    dateFilter: 'Hoje' | 'Ontem' | 'Esta Semana' | 'Este Mês' | 'Custom';
    setDateFilter: (filter: 'Hoje' | 'Ontem' | 'Esta Semana' | 'Este Mês' | 'Custom') => void;

    // Actions
    addProfile: (name: string) => void;
    addSale: (sale: Omit<Sale, 'id' | 'saleDate'>) => void;
    addPendingInvestment: (investment: Omit<PendingInvestment, 'id' | 'registeredDate' | 'isResolved'>) => void;
    registerDaily: (name: string) => void;

    // Formulas
    getFilteredSales: () => Sale[];
    calculateMetrics: (sales: Sale[], fees: Fee[]) => {
        roi: number; lucroLiquido: number; retornoBruto: number;
        gastoAds: number; taxasAplicadas: number; vendasConcluidas: number
    };
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [activeProfileId, setActiveProfileId] = useState<string>('');
    const [allProfileData, setAllProfileData] = useState<AllProfileData>({});
    const [dateFilter, setDateFilter] = useState<'Hoje' | 'Ontem' | 'Esta Semana' | 'Este Mês' | 'Custom'>('Hoje');
    const [dailyRegistrationName, setDailyRegistrationName] = useState('');

    // Carregar dados iniciais do LocalStorage
    useEffect(() => {
        const savedData = localStorage.getItem('allProfileData');
        const savedActiveId = localStorage.getItem('activeProfileId');

        if (savedData) {
            setAllProfileData(JSON.parse(savedData));
        } else {
            // Perfil padrão se não existir nenhum
            const defaultProfileId = crypto.randomUUID();
            const defaultData: AllProfileData = {
                [defaultProfileId]: {
                    profile: { id: defaultProfileId, name: 'Principal' },
                    fees: [], goals: [], sales: [], pendingInvestments: []
                }
            };
            setAllProfileData(defaultData);
            localStorage.setItem('allProfileData', JSON.stringify(defaultData));
        }

        if (savedActiveId && savedData && JSON.parse(savedData)[savedActiveId]) {
            setActiveProfileId(savedActiveId);
        } else if (savedData) {
            const firstProfileId = Object.keys(JSON.parse(savedData))[0];
            if (firstProfileId) setActiveProfileId(firstProfileId);
        } else {
            const firstId = Object.keys(allProfileData)[0];
            if (firstId) setActiveProfileId(firstId);
        }
    }, []);

    // Salvar alterações sempre que allProfileData mudar
    useEffect(() => {
        if (Object.keys(allProfileData).length > 0) {
            localStorage.setItem('allProfileData', JSON.stringify(allProfileData));
        }
    }, [allProfileData]);

    useEffect(() => {
        if (activeProfileId) {
            localStorage.setItem('activeProfileId', activeProfileId);
        }
    }, [activeProfileId]);

    const profileData = allProfileData[activeProfileId];

    // Actions
    const registerDaily = (name: string) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const registration = `${todayStr} - ${name}`;
        setAllProfileData(prev => ({
            ...prev,
            [activeProfileId]: { ...prev[activeProfileId], dailyRegistration: registration }
        }));
    };

    const addProfile = (name: string) => {
        const newId = crypto.randomUUID();
        setAllProfileData(prev => ({
            ...prev,
            [newId]: { profile: { id: newId, name }, fees: [], goals: [], sales: [], pendingInvestments: [] }
        }));
        setActiveProfileId(newId);
    };

    const addSale = (sale: Omit<Sale, 'id' | 'saleDate'>) => {
        if (!activeProfileId) return;
        const newSale: Sale = { ...sale, id: crypto.randomUUID(), saleDate: new Date().toISOString() };
        setAllProfileData(prev => ({
            ...prev,
            [activeProfileId]: {
                ...prev[activeProfileId],
                sales: [...prev[activeProfileId].sales, newSale]
            }
        }));
    };

    const addPendingInvestment = (investment: Omit<PendingInvestment, 'id' | 'registeredDate' | 'isResolved'>) => {
        if (!activeProfileId) return;
        const newInv: PendingInvestment = { ...investment, id: crypto.randomUUID(), registeredDate: new Date().toISOString(), isResolved: false };
        setAllProfileData(prev => ({
            ...prev,
            [activeProfileId]: {
                ...prev[activeProfileId],
                pendingInvestments: [...prev[activeProfileId].pendingInvestments, newInv]
            }
        }));
    };

    const getFilteredSales = () => {
        if (!profileData) return [];
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const yesterdayDate = new Date(now);
        yesterdayDate.setDate(now.getDate() - 1);
        const yesterday = yesterdayDate.toISOString().split('T')[0];

        return profileData.sales.filter(sale => {
            const saleDateStr = sale.saleDate.split('T')[0];
            if (dateFilter === 'Hoje') return saleDateStr === today;
            if (dateFilter === 'Ontem') return saleDateStr === yesterday;
            // Adicionar filtros da semana e mês aqui depois
            return true;
        });
    };

    const calculateMetrics = (sales: Sale[], fees: Fee[]) => {
        let retornoBruto = 0;
        let gastoAds = 0;
        let taxasAplicadas = 0;
        let vendasConcluidas = 0;

        // TODO: Taxas Unique por período!
        const uniqueFees = fees.filter(f => f.type === 'unique' && f.isActive).reduce((acc, f) => acc + Number(f.amount), 0);

        sales.forEach(sale => {
            retornoBruto += Number(sale.amount);
            gastoAds += Number(sale.investedAmount);
            vendasConcluidas++;

            if (sale.applyFees) {
                // Cálculo de taxas per-sale, fixed, percentage
                fees.forEach(fee => {
                    if (!fee.isActive || fee.type === 'unique') return;
                    if (fee.type === 'fixed' || fee.type === 'per-sale') taxasAplicadas += Number(fee.amount);
                    if (fee.type === 'percentage') taxasAplicadas += (Number(sale.amount) * (Number(fee.amount) / 100));
                });
            }
        });

        taxasAplicadas += uniqueFees;

        // Lucro = Retorno - (Investimento + Taxas)
        const lucroLiquido = retornoBruto - (gastoAds + taxasAplicadas);

        // ROI = Retorno / (Investimento + Taxas)
        const divisor = gastoAds + taxasAplicadas;
        const roi = divisor > 0 ? (retornoBruto / divisor) : 0;

        return { roi, lucroLiquido, retornoBruto, gastoAds, taxasAplicadas, vendasConcluidas };
    };

    return (
        <AppContext.Provider value={{
            activeProfileId, setActiveProfileId, allProfileData, profileData,
            dailyRegistrationName, setDailyRegistrationName,
            dateFilter, setDateFilter, addProfile, addSale, addPendingInvestment, registerDaily,
            getFilteredSales, calculateMetrics
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};
