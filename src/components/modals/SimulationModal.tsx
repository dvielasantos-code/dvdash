import { useState } from 'react';
import { X, Calculator, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface SimulationModalProps {
    onClose: () => void;
}

export default function SimulationModal({ onClose }: SimulationModalProps) {
    const { profileData, getFilteredSales, calculateMetrics } = useAppContext();
    const [hypoInvestment, setHypoInvestment] = useState('');
    const [hypoReturn, setHypoReturn] = useState('');

    const sales = getFilteredSales();
    const fees = profileData?.fees || [];

    // Real metrics
    const realMetrics = calculateMetrics(sales, fees);

    // Simulated metrics
    const simSales = [...sales, {
        id: 'sim',
        investedAmount: Number(hypoInvestment) || 0,
        amount: Number(hypoReturn) || 0,
        applyFees: true,
        saleDate: new Date().toISOString()
    }];

    const simMetrics = calculateMetrics(simSales, fees);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-2xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Calculator className="text-accent" /> Simulação de Cenário
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h4 className="text-slate-400 font-medium mb-2">Entrada da Simulação</h4>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Se eu investir (R$)</label>
                            <input
                                type="number"
                                value={hypoInvestment}
                                onChange={(e) => setHypoInvestment(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">E retornar (R$)</label>
                            <input
                                type="number"
                                value={hypoReturn}
                                onChange={(e) => setHypoReturn(e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-xl">
                            <p className="text-sm text-accent max-w-sm">Esta simulação soma os valores escolhidos com os dados reais já registrados no período atual.</p>
                        </div>
                    </div>

                    <div className="bg-black/20 border border-white/5 rounded-xl p-5 space-y-4">
                        <h4 className="text-slate-400 font-medium border-b border-white/5 pb-2">Projeção do Resultado</h4>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-300">Lucro Líquido:</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 line-through text-xs">R$ {realMetrics.lucroLiquido.toFixed(2)}</span>
                                <ArrowRight size={14} className="text-slate-400" />
                                <span className={`font-bold ${simMetrics.lucroLiquido >= 0 ? 'text-secondary' : 'text-danger'}`}>
                                    R$ {simMetrics.lucroLiquido.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-300">ROI:</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 line-through text-xs">{realMetrics.roi.toFixed(2)}</span>
                                <ArrowRight size={14} className="text-slate-400" />
                                <span className={`font-bold ${simMetrics.roi >= 1 ? 'text-secondary' : 'text-danger'}`}>
                                    {simMetrics.roi.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-slate-300">Vendas:</span>
                            <div className="flex items-center gap-2">
                                <span className="text-slate-500 line-through text-xs">{realMetrics.vendasConcluidas}</span>
                                <ArrowRight size={14} className="text-slate-400" />
                                <span className="font-bold text-white">
                                    {simMetrics.vendasConcluidas}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
