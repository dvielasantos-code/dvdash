import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function DailyRegistrationModal() {
    const { registerDaily, dailyRegistrationName } = useAppContext();
    const [name, setName] = useState('');

    const todayStr = new Date().toISOString().split('T')[0];
    const isRegisteredForToday = dailyRegistrationName.startsWith(todayStr);

    if (isRegisteredForToday) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        registerDaily(name);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
            <div className="w-full max-w-md p-8 bg-surface border border-white/10 rounded-3xl shadow-2xl glass-panel relative overflow-hidden text-center">
                {/* Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>

                <div className="relative z-10 space-y-6">
                    <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] mb-6">
                        AVT
                    </div>

                    <h2 className="text-3xl font-bold text-white">Pronto para a escala?</h2>
                    <p className="text-slate-400">Insira um nome para registrar a operação de hoje antes de acessar o painel de métricas.</p>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-center text-lg text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                placeholder="Ex: Escala Manhã"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-slate-200 shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                        >
                            <Play size={20} className="text-black fill-black" />
                            Iniciar Dia
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
