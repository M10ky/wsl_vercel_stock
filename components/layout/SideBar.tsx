// components/layout/Sidebar.tsx
'use client';

import { useStock } from '@/hooks/useStock';
import { LogOut, LayoutDashboard, Package, ArrowLeftRight, ClipboardList, Bell, History, BarChart3, Users, Settings } from 'lucide-react';

interface SidebarProps {
  tab: string;
  setTab: (tab: string) => void;
}

export default function Sidebar({ tab, setTab }: SidebarProps) {
  const { profile } = useStock();

  const isAdmin = profile?.role === 'Administrateur';
  const canSeeIT = profile?.dept === 'IT' || profile?.dept === 'both' || isAdmin;
  const canSeeFin = profile?.dept === 'Finance' || profile?.dept === 'both' || isAdmin;

  return (
    <div className="w-60 bg-slate-900 text-white flex flex-col h-screen">
      {/* Logo */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
          📦
        </div>
        <div>
          <div className="font-bold text-lg">Connecteo</div>
          <div className="text-[10px] text-slate-400 -mt-1">STOCK v5.0</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto">
        { (isAdmin || (canSeeIT && canSeeFin)) && (
          <>
            <div className="text-xs font-bold text-slate-500 px-3 py-2">VUE GÉNÉRALE</div>
            <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
          </>
        )}

        {canSeeIT && (
          <>
            <div className="text-xs font-bold text-slate-500 px-3 py-2 mt-6">STOCK IT</div>
            <NavItem icon={<Package size={18} />} label="Inventaire IT" active={tab === 'stock-it'} onClick={() => setTab('stock-it')} />
            <NavItem icon={<ArrowLeftRight size={18} />} label="Mouvements IT" active={tab === 'mvt-it'} onClick={() => setTab('mvt-it')} />
            <NavItem icon={<ClipboardList size={18} />} label="Demandes IT" active={tab === 'dem-it'} onClick={() => setTab('dem-it')} />
            <NavItem icon={<Bell size={18} />} label="Alertes IT" active={tab === 'alertes-it'} onClick={() => setTab('alertes-it')} />
          </>
        )}

        {canSeeFin && (
          <>
            <div className="text-xs font-bold text-slate-500 px-3 py-2 mt-6">STOCK FINANCE</div>
            <NavItem icon={<Package size={18} />} label="Inventaire Finance" active={tab === 'stock-fin'} onClick={() => setTab('stock-fin')} />
            <NavItem icon={<ArrowLeftRight size={18} />} label="Mouvements Finance" active={tab === 'mvt-fin'} onClick={() => setTab('mvt-fin')} />
            <NavItem icon={<ClipboardList size={18} />} label="Demandes Finance" active={tab === 'dem-fin'} onClick={() => setTab('dem-fin')} />
            <NavItem icon={<Bell size={18} />} label="Alertes Finance" active={tab === 'alertes-fin'} onClick={() => setTab('alertes-fin')} />
          </>
        )}

        {(isAdmin || canSeeIT || canSeeFin) && (
          <>
            <div className="text-xs font-bold text-slate-500 px-3 py-2 mt-6">ANALYSE</div>
            <NavItem icon={<History size={18} />} label="Historique" active={tab === 'historique'} onClick={() => setTab('historique')} />
            <NavItem icon={<BarChart3 size={18} />} label="Rapports" active={tab === 'rapports'} onClick={() => setTab('rapports')} />
          </>
        )}

        {isAdmin && (
          <>
            <div className="text-xs font-bold text-slate-500 px-3 py-2 mt-6">ADMINISTRATION</div>
            <NavItem icon={<Users size={18} />} label="Utilisateurs" active={tab === 'utilisateurs'} onClick={() => setTab('utilisateurs')} />
            <NavItem icon={<Settings size={18} />} label="Paramètres" active={tab === 'params'} onClick={() => setTab('params')} />
          </>
        )}
      </nav>

      {/* Footer User Info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center text-sm font-bold">
            {profile?.name?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{profile?.name}</div>
            <div className="text-xs text-slate-400 truncate">{profile?.role}</div>
          </div>
          <button 
            onClick={() => supabase.auth.signOut()}
            className="text-slate-400 hover:text-red-400 transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition mb-0.5
        ${active ? 'bg-teal-600 text-white' : 'hover:bg-white/10 text-slate-300'}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}