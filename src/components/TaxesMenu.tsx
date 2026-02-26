import { useState } from 'react';
import { Plus, Percent, Trash2, Edit3, Save } from 'lucide-react';

interface Taxa {
    id: number;
    nome: string;
    valor: number;
    tipo: 'percentual' | 'fixo';
}

export default function TaxesMenu() {
    const [taxas, setTaxas] = useState<Taxa[]>([
        { id: 1, nome: 'Taxa Gateway', valor: 4.99, tipo: 'percentual' },
        { id: 2, nome: 'Tarifa Anti-Fraude', valor: 1.50, tipo: 'fixo' },
        { id: 3, nome: 'Imposto Estadual', valor: 2.00, tipo: 'percentual' },
    ]);

    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState<'percentual' | 'fixo'>('percentual');

    const addTaxa = () => {
        if (!nome || !valor) return;
        setTaxas([...taxas, { id: Date.now(), nome, valor: parseFloat(valor), tipo }]);
        setNome('');
        setValor('');
    };

    const deleteTaxa = (id: number) => {
        setTaxas(taxas.filter(t => t.id !== id));
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">Gestão de Taxas</h2>
                <p className="text-slate-400 mt-1">Configure suas taxas de operadoras, impostos e gateway para o cálculo correto de ROI.</p>
            </div>

            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-indigo-400" />
                    Adicionar Nova Taxa
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Nome da Taxa</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Ex: Taxa de Cartão Crédito"
                            className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Valor</label>
                        <input
                            type="number"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full bg-surface/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div className="w-full md:w-40">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Tipo</label>
                        <div className="flex bg-surface/50 border border-white/10 rounded-xl overflow-hidden p-1">
                            <button
                                onClick={() => setTipo('percentual')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${tipo === 'percentual' ? 'bg-indigo-500 relative shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white'}`}
                            >
                                %
                            </button>
                            <button
                                onClick={() => setTipo('fixo')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-colors ${tipo === 'fixo' ? 'bg-indigo-500 relative shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:text-white'}`}
                            >
                                R$
                            </button>
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={addTaxa}
                            className="h-11 px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-semibold rounded-xl w-full shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
                        >
                            <Save size={18} className="group-hover:animate-pulse" />
                            Salvar
                        </button>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/[0.02] border-b border-white/5">
                            <th className="p-4 font-semibold text-slate-300">Despesa / Taxa</th>
                            <th className="p-4 font-semibold text-slate-300">Valor Aplicado</th>
                            <th className="p-4 font-semibold text-slate-300">Tipo de Cobrança</th>
                            <th className="p-4 font-semibold text-slate-300 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxas.map((taxa) => (
                            <tr key={taxa.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4 text-slate-200 font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                        <Percent size={14} className="text-slate-400" />
                                    </div>
                                    {taxa.nome}
                                </td>
                                <td className="p-4 text-white font-bold">
                                    {taxa.tipo === 'percentual' ? `${taxa.valor}%` : `R$ ${taxa.valor.toFixed(2)}`}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${taxa.tipo === 'percentual' ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-green-500/10 border-green-500/20 text-green-400'}`}>
                                        {taxa.tipo === 'percentual' ? 'Percentual (%)' : 'Valor Fixo (R$)'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                                            <Edit3 size={16} />
                                        </button>
                                        <button onClick={() => deleteTaxa(taxa.id)} className="p-2 text-danger/70 hover:text-danger bg-danger/5 rounded-lg hover:bg-danger/10 transition-colors shadow-sm">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {taxas.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                    Nenhuma taxa configurada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
