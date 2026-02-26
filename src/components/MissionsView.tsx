import { Target, Trophy, ChevronRight, Zap } from 'lucide-react';

export default function MissionsView() {
    const missoes = [
        {
            id: 1,
            titulo: 'Primeiros 500 Pedidos',
            descricao: 'Atinja a marca de 500 vendas aprovadas no mês.',
            meta: 500,
            atual: 342,
            cor: 'from-amber-400 to-orange-500',
            icone: <Trophy size={24} className="text-orange-400" />
        },
        {
            id: 2,
            titulo: 'Ticket Médio de Aço',
            descricao: 'Mantenha o ticket médio acima de R$ 100 por 7 dias.',
            meta: 100,
            atual: 89,
            cor: 'from-blue-400 to-indigo-500',
            icone: <Zap size={24} className="text-blue-400" />
        },
        {
            id: 3,
            titulo: 'Conversão Ninja',
            descricao: 'Atinja 5% de taxa de conversão na sua loja.',
            meta: 5,
            atual: 3.2,
            cor: 'from-emerald-400 to-teal-500',
            icone: <Target size={24} className="text-emerald-400" />
        },
    ];

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8 cursor-default">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-rose-500 flex items-center gap-3">
                        Missões <Trophy size={28} className="text-orange-400" fill="currentColor" />
                    </h2>
                    <p className="text-slate-400 mt-1">Conclua desafios para liberar novas conquistas e marcos no seu faturamento.</p>
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all flex items-center gap-2 hover:scale-105">
                    <Target size={18} />
                    Nova Missão
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {missoes.map((missao) => {
                    const porcentagem = Math.min((missao.atual / missao.meta) * 100, 100);

                    return (
                        <div key={missao.id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500 cursor-pointer">
                            {/* Background Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${missao.cor} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700`}></div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-surface_hover border border-white/5 flex items-center justify-center mb-6 shadow-lg">
                                    {missao.icone}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{missao.titulo}</h3>
                                <p className="text-sm text-slate-400 mb-6 h-10">{missao.descricao}</p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span className="text-slate-300">Progresso</span>
                                        <span className="text-white">{missao.atual} / {missao.meta}</span>
                                    </div>

                                    <div className="w-full h-3 bg-surface_hover rounded-full overflow-hidden border border-white/5 shadow-inner">
                                        <div
                                            className={`h-full bg-gradient-to-r ${missao.cor} relative`}
                                            style={{ width: `${porcentagem}%` }}
                                        >
                                            <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 skew-x-12 animate-[shimmer_2s_infinite]"></div>
                                        </div>
                                    </div>
                                    <div className="text-right text-xs text-slate-500 font-semibold mt-1">
                                        {porcentagem.toFixed(1)}% Completo
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button className={`flex items-center gap-1 text-sm font-semibold bg-gradient-to-r ${missao.cor} bg-clip-text text-transparent group-hover:gap-2 transition-all`}>
                                        Ver Detalhes
                                        <ChevronRight size={16} className={`text-${missao.cor.split(' ')[1].split('-')[1]}-400`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(400%) skewX(-15deg); }
        }
      `}} />
        </div>
    );
}
