import { useState } from 'react';
import { LayoutDashboard, Percent, Target, Bot, Settings, LogOut, Bell, ShieldX } from 'lucide-react';
import { useAppContext } from './context/AppContext';
import MetricsDashboard from './components/MetricsDashboard';
import TaxesMenu from './components/TaxesMenu';
import MissionsView from './components/MissionsView';
import AIChat from './components/AIChat';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'taxas' | 'missoes' | 'chat'>('dashboard');
  const { dailyRegistrationName, profileData } = useAppContext();

  const todayStr = new Date().toISOString().split('T')[0];
  const isRegisteredForToday = dailyRegistrationName.startsWith(todayStr);
  const registeredName = isRegisteredForToday ? dailyRegistrationName.split(' - ')[1] : '';

  const getFormatDate = () => {
    const d = new Date();
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(d);
  };

  return (
    <div className="flex h-screen w-full bg-[#0B0B0F] text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col glass-panel z-10 p-4 border-r border-[#1C1C26]">
        <div className="flex items-center gap-3 mb-10 px-2 mt-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            A
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Aura Analytics
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem
            active={activeTab === 'dashboard'}
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
          />
          <NavItem
            active={activeTab === 'taxas'}
            onClick={() => setActiveTab('taxas')}
            icon={<Percent size={20} />}
            label="Taxas e Custos"
          />
          <NavItem
            active={activeTab === 'missoes'}
            onClick={() => setActiveTab('missoes')}
            icon={<Target size={20} />}
            label="Missões"
          />
        </nav>

        <div className="mt-auto space-y-2 pt-4 border-t border-white/5">
          <NavItem
            active={activeTab === 'chat'}
            onClick={() => setActiveTab('chat')}
            icon={<Bot size={20} className={activeTab === 'chat' ? 'text-primary' : 'text-primary/70'} />}
            label="IA Analista"
            glow
          />
          <NavItem
            active={false}
            onClick={() => { }}
            icon={<Settings size={20} />}
            label="Configurações"
          />
          <NavItem
            active={false}
            onClick={() => { }}
            icon={<LogOut size={20} />}
            label="Sair"
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface/40 via-[#0B0B0F] to-[#0B0B0F]">
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/[0.02]">
          <div className="flex-1">
            {isRegisteredForToday && (
              <div className="flex items-center gap-4 bg-surface_hover border border-white/5 rounded-full px-4 py-2 w-max shadow-lg">
                <div className="w-10 h-10 rounded-full bg-secondary text-white font-bold flex items-center justify-center text-lg">
                  {profileData?.sales?.length || 0}
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-tight">Dia: "{registeredName}"</p>
                  <p className="text-xs text-slate-400">Perfil: "{profileData?.profile?.name}"</p>
                </div>
                <div className="ml-6 flex items-center gap-4 border-l border-white/10 pl-6">
                  <span className="text-sm text-slate-300 font-medium">{getFormatDate()}</span>
                  <button className="w-10 h-10 rounded-xl bg-danger/20 hover:bg-danger/40 border border-danger/30 text-danger flex items-center justify-center transition-colors cursor-pointer">
                    <ShieldX size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-[#0B0B0F]"></div>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="w-9 h-9 rounded-full bg-surface_hover border border-white/10 flex items-center justify-center">
                <span className="text-sm font-medium">LF</span>
              </div>
              <div className="hidden md:block text-sm">
                <p className="font-medium text-slate-200">Lucas Ferreira</p>
                <p className="text-slate-500 text-xs">Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && <MetricsDashboard />}
            {activeTab === 'taxas' && <TaxesMenu />}
            {activeTab === 'missoes' && <MissionsView />}
            {activeTab === 'chat' && <AIChat />}
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label, glow = false }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, glow?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-300 relative group overflow-hidden ${active
        ? 'bg-primary/10 text-white'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
        }`}
    >
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>
      )}
      {glow && active && (
        <div className="absolute inset-0 bg-primary/20 blur-xl z-0"></div>
      )}
      <div className={`relative z-10 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      <span className="font-medium relative z-10 text-sm tracking-wide">{label}</span>
    </button>
  );
}
