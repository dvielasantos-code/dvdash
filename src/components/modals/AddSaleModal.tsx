import React, { useState } from 'react';
import { X, DollarSign, Plus } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface AddSaleModalProps {
    onClose: () => void;
}

export default function AddSaleModal({ onClose }: AddSaleModalProps) {
    const { addSale, addPendingInvestment } = useAppContext();
    const [investedAmount, setInvestedAmount] = useState('');
    const [returns, setReturns] = useState<string[]>(['']);
    const [applyFees, setApplyFees] = useState(true);

    const presets = [50, 100, 200, 500];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const invStr = investedAmount.replace(',', '.');
        const inv = Number(invStr) || 0;

        // Se o investimento for <= 0, avisa ou não faz nada, mas como o user queria que nao travasse,
        // vamos só seguir a lógica: se não tem ADS, é só registrar a venda com ads 0.

        // Extrai apenas os retornos válidos maiores que 0
        const validReturns = returns.map(r => Number(r.replace(',', '.'))).filter(r => !isNaN(r) && r > 0);

        if (validReturns.length > 0) {
            // Divide o investimento pelo número de retornos válidos (Multi-Entrada)
            const dividedInv = inv / validReturns.length;

            validReturns.forEach(ret => {
                addSale({
                    investedAmount: dividedInv,
                    amount: ret,
                    applyFees,
                });
            });
        } else {
            // Se nenhum retorno válido, e tem Ads > 0, vira Investimento Pendente
            if (inv > 0) {
                addPendingInvestment({
                    investedAmount: inv,
                });
            }
        }

        onClose();
    };

    const addReturnField = () => {
        setReturns([...returns, '']);
    };

    const updateReturn = (index: number, value: string) => {
        const newReturns = [...returns];
        newReturns[index] = value;
        setReturns(newReturns);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-[#12121A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <DollarSign className="text-primary" /> Registrar Ação
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Gasto em ADS (Investido)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={investedAmount}
                                    onChange={(e) => setInvestedAmount(e.target.value)}
                                    className="w-full bg-[#1C1C26] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    placeholder="Deixe vazio ou 0 se foi orgânico"
                                />
                            </div>
                            <div className="flex gap-2 mt-2">
                                {presets.map(p => (
                                    <button type="button" key={p} onClick={() => setInvestedAmount(p.toString())} className="flex-1 py-1.5 text-xs rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors border border-white/5">
                                        +R${p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-300">Retornos (Vendas Múltiplas)</label>
                            <p className="text-xs text-slate-500 -mt-2 mb-2">Se não digitar retorno e tiver ADS, vira Investimento Pendente.</p>

                            {returns.map((ret, idx) => (
                                <div key={idx} className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={ret}
                                        onChange={(e) => updateReturn(idx, e.target.value)}
                                        className="w-full bg-[#1C1C26] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-bold text-secondary"
                                        placeholder="Valor da venda"
                                    />
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addReturnField}
                                className="w-full flex items-center justify-center gap-1 py-2 text-sm text-slate-400 hover:text-white border border-dashed border-white/10 hover:border-white/30 rounded-xl transition-all"
                            >
                                <Plus size={16} /> Adicionar outro retorno (divide o ADS)
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div>
                                <p className="text-sm font-medium text-white">Aplicar taxas de venda?</p>
                                <p className="text-xs text-slate-400">Desconta gateways e impostos per-sale.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={applyFees} onChange={(e) => setApplyFees(e.target.checked)} />
                                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all text-lg"
                        >
                            Registrar no Sistema
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
