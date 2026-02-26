import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

interface Message {
    id: number;
    author: 'user' | 'ia';
    text: string;
}

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            author: 'ia',
            text: 'Olá! Eu sou a Aura Analytics IA. Estou analisando seu dashboard neste momento. Como posso te ajudar a melhorar suas conversões de vendas e lucros?'
        }
    ]);

    const [inputVal, setInputVal] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        if (!inputVal.trim()) return;

        setMessages([...messages, { id: Date.now(), author: 'user', text: inputVal }]);
        setInputVal('');

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: Date.now(),
                author: 'ia',
                text: 'Analisando seus dados: Notei uma queda de 2% no seu ROI na última terça-feira. Uma dica seria pausar os anúncios com CTR menor que 1.5%!'
            }]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto pb-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent flex items-center gap-2">
                        Aura Analista IA
                        <Sparkles size={20} className="text-accent animate-pulse" />
                    </h2>
                    <p className="text-slate-400 text-sm">Sua parceira de inteligência artificial 24h.</p>
                </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden relative border border-white/5">

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex w-full ${msg.author === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-4 max-w-[80%] ${msg.author === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>

                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-lg ${msg.author === 'user' ? 'bg-surface_hover border border-white/10' : 'bg-gradient-to-tr from-primary to-accent shadow-primary/30'
                                    }`}>
                                    {msg.author === 'user' ? <User size={18} className="text-slate-300" /> : <Bot size={18} className="text-white" />}
                                </div>

                                {/* Bubble */}
                                <div className={`p-4 rounded-2xl text-[15px] leading-relaxed relative ${msg.author === 'user'
                                        ? 'bg-primary/20 text-white rounded-tr-none border border-primary/30'
                                        : 'bg-surface_hover text-slate-200 rounded-tl-none border border-white/5'
                                    }`} style={{ wordBreak: 'break-word' }}>
                                    {msg.text}
                                    {/* Subtle Glow for AI */}
                                    {msg.author === 'ia' && (
                                        <div className="absolute inset-0 border border-transparent rounded-2xl shadow-[inset_0_0_15px_rgba(99,102,241,0.05)] pointer-events-none"></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="p-4 bg-surface/80 border-t border-white/5 backdrop-blur-md">
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="flex items-center gap-3 relative"
                    >
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputVal}
                                onChange={(e) => setInputVal(e.target.value)}
                                placeholder="Pergunte sobre seu ROI, chargebacks, dicas..."
                                className="w-full bg-[#0B0B0F] border border-white/10 rounded-full pl-6 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!inputVal.trim()}
                            className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            <Send size={18} className="-ml-0.5 mt-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
