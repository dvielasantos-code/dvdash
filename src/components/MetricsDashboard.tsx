import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Zap, TrendingUp, TrendingDown, Target, ShoppingCart, Plus, Calculator, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import AddSaleModal from './modals/AddSaleModal';
import SimulationModal from './modals/SimulationModal';
import DailyRegistrationModal from './modals/DailyRegistrationModal';

const data: any[] = [];

export default function MetricsDashboard() {
    const {
        profileData, getFilteredSales, calculateMetrics,
        dateFilter, setDateFilter, dailyRegistrationName
    } = useAppContext();

    const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
    const [isSimOpen, setIsSimOpen] = useState(false);

    // If no context yet or no daily registration for today
    const todayStr = new Date().toISOString().split('T')[0];
    const isRegistered = dailyRegistrationName?.startsWith(todayStr);

    if (!isRegistered) {
        return <DailyRegistrationModal />;
    }

    const sales = getFilteredSales();
    const fees = profileData?.fees || [];
    const metrics = calculateMetrics(sales, fees);

    const formatCurrency = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8 cursor-default hover:text-white transition-colors">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Visão Geral</h2>
                    <p className="text-slate-400 mt-1">Acompanhe suas métricas de vendas e performance.</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-3">
                        <button onClick={() => setIsSimOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-surface_hover border border-white/10 text-slate-200 hover:bg-white/5 transition-all cursor-pointer">
                            <Calculator size={16} className="text-accent" />
                            Suposição
                        </button>
                        <button onClick={() => setIsAddSaleOpen(true)} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all cursor-pointer">
                            <Plus size={16} />
                            Add Venda
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-1 bg-surface/80 p-1 rounded-xl glass-panel">
                        {['Hoje', 'Ontem', 'Esta Semana', 'Este Mês'].map(f => (
                            <button
                                key={f}
                                onClick={() => setDateFilter(f as any)}
                                className={`px-3 py-1.5 text-xs md:text-sm rounded-lg font-medium transition-all shadow-sm cursor-pointer ${dateFilter === f ? 'bg-white/10 text-white shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5 outline-none'}`}
                            >
                                {f}
                            </button>
                        ))}
                        <button className="px-3 py-1.5 text-xs md:text-sm rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all outline-none cursor-pointer flex items-center gap-1"><Calendar size={14} /> Custom</button>
                    </div>
                </div>
            </div>

            {/* Grid of 6 Cards - Requirement */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Lucro Líquido"
                    value={formatCurrency(metrics.lucroLiquido)}
                    trend="0%"
                    isPositive={metrics.lucroLiquido >= 0}
                    icon={<CheckCircle2 size={24} className="text-secondary" />}
                    color="secondary"
                />
                <MetricCard
                    title="Retorno Bruto"
                    value={formatCurrency(metrics.retornoBruto)}
                    trend="0%"
                    isPositive={true}
                    icon={<DollarSign size={24} className="text-primary" />}
                    color="primary"
                />
                <MetricCard
                    title="ROI Geral"
                    value={metrics.roi.toFixed(2)}
                    trend="0%"
                    isPositive={metrics.roi >= 1.0}
                    icon={<Zap size={24} className="text-accent" />}
                    color="accent"
                />
                <MetricCard
                    title="Gasto em ADS"
                    value={formatCurrency(metrics.gastoAds)}
                    trend="0%"
                    isPositive={false}
                    icon={<TrendingDown size={24} className="text-danger" />}
                    color="danger"
                />
                <MetricCard
                    title="Taxas Aplicadas"
                    value={formatCurrency(metrics.taxasAplicadas)}
                    trend="0%"
                    isPositive={false}
                    icon={<ShoppingCart size={24} className="text-blue-400" />}
                    color="blue"
                />
                <MetricCard
                    title="Vendas Concluídas"
                    value={metrics.vendasConcluidas.toString()}
                    trend="0%"
                    isPositive={true}
                    icon={<Target size={24} className="text-orange-400" />}
                    color="orange"
                />
            </div>

            {/* Main Chart */}
            <div className="glass-panel rounded-2xl p-6 mt-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700"></div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-200">Receita vs Aprovados</h3>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                            <span className="text-slate-400">Faturamento</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                            <span className="text-slate-400">Aprovados</span>
                        </div>
                    </div>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorAprovado" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748B" tick={{ fill: '#64748B' }} axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748B" tick={{ fill: '#64748B' }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value}`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(18,18,26,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="faturamento" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#colorFaturamento)" />
                            <Area type="monotone" dataKey="aprovado" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorAprovado)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Modals */}
            {isAddSaleOpen && <AddSaleModal onClose={() => setIsAddSaleOpen(false)} />}
            {isSimOpen && <SimulationModal onClose={() => setIsSimOpen(false)} />}
        </div>
    );
}

function MetricCard({ title, value, trend, isPositive, icon, color }: { title: string, value: string, trend: string, isPositive: boolean, icon: React.ReactNode, color: string }) {
    const getGlowColor = () => {
        switch (color) {
            case 'primary': return 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] group-hover:border-primary/50';
            case 'secondary': return 'group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] group-hover:border-secondary/50';
            case 'accent': return 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] group-hover:border-accent/50';
            case 'blue': return 'group-hover:shadow-[0_0_30px_rgba(96,165,250,0.15)] group-hover:border-blue-400/50';
            case 'orange': return 'group-hover:shadow-[0_0_30px_rgba(251,146,60,0.15)] group-hover:border-orange-400/50';
            case 'danger': return 'group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] group-hover:border-danger/50';
            default: return 'group-hover:border-white/20';
        }
    };

    const trendColor = isPositive ? 'text-secondary' : 'text-danger';
    const TrendIcon = isPositive ? TrendingUp : TrendingDown;

    return (
        <div className={`glass-panel p-6 rounded-2xl relative overflow-hidden group transition-all duration-500 hover:-translate-y-1 ${getGlowColor()}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm font-medium">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 ${trendColor}`}>
                    <TrendIcon size={14} />
                    {trend}
                </span>
                <span className="text-slate-500">vs mês anterior</span>
            </div>

            {/* Subtle corner glow */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-${color === 'primary' ? 'indigo-500' : color === 'secondary' ? 'emerald-500' : 'white'}`}></div>
        </div>
    );
}
