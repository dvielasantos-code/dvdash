import { ArrowUpRight, ArrowDownRight, DollarSign, CheckCircle2, Zap, TrendingUp, TrendingDown, Target, ShoppingCart } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Seg', faturamento: 4000, aprovado: 2400 },
    { name: 'Ter', faturamento: 3000, aprovado: 1398 },
    { name: 'Qua', faturamento: 2000, aprovado: 9800 },
    { name: 'Qui', faturamento: 2780, aprovado: 3908 },
    { name: 'Sex', faturamento: 1890, aprovado: 4800 },
    { name: 'Sáb', faturamento: 2390, aprovado: 3800 },
    { name: 'Dom', faturamento: 3490, aprovado: 4300 },
];

export default function MetricsDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-8 cursor-default hover:text-white transition-colors">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Visão Geral</h2>
                    <p className="text-slate-400 mt-1">Acompanhe suas métricas de vendas e performance.</p>
                </div>
                <div className="flex gap-2 bg-surface/80 p-1 rounded-xl glass-panel">
                    <button className="px-4 py-1.5 text-sm rounded-lg bg-white/10 text-white font-medium shadow-sm transition-all shadow-primary/20 cursor-pointer">Hoje</button>
                    <button className="px-4 py-1.5 text-sm rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all outline-none cursor-pointer">7 Dias</button>
                    <button className="px-4 py-1.5 text-sm rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all outline-none cursor-pointer">30 Dias</button>
                </div>
            </div>

            {/* Grid of 6 Cards - Requirement */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    title="Faturamento Total"
                    value="R$ 45.231,89"
                    trend="+12.5%"
                    isPositive={true}
                    icon={<DollarSign size={24} className="text-primary" />}
                    color="primary"
                />
                <MetricCard
                    title="Vendas Aprovadas"
                    value="1.204"
                    trend="+8.2%"
                    isPositive={true}
                    icon={<CheckCircle2 size={24} className="text-secondary" />}
                    color="secondary"
                />
                <MetricCard
                    title="ROI Geral"
                    value="245%"
                    trend="+15.3%"
                    isPositive={true}
                    icon={<Zap size={24} className="text-accent" />}
                    color="accent"
                />
                <MetricCard
                    title="Ticket Médio"
                    value="R$ 37,50"
                    trend="-2.1%"
                    isPositive={false}
                    icon={<ShoppingCart size={24} className="text-blue-400" />}
                    color="blue"
                />
                <MetricCard
                    title="Taxa de Conversão"
                    value="3.2%"
                    trend="+0.4%"
                    isPositive={true}
                    icon={<Target size={24} className="text-orange-400" />}
                    color="orange"
                />
                <MetricCard
                    title="Chargeback / Reembolso"
                    value="1.8%"
                    trend="-0.5%"
                    isPositive={true}
                    icon={<TrendingDown size={24} className="text-danger" />}
                    color="danger"
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
