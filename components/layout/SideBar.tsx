'use client';
import { supabase } from '@/lib/supabase';    // ← FIX manquant
import { useStock } from '@/hooks/useStock';
import {
  LayoutDashboard, Package, ArrowLeftRight, ClipboardList,
  Bell, History, BarChart3, Users, Settings, LogOut,
} from 'lucide-react';

interface SidebarProps {
  tab: string;
  setTab: (tab: string) => void;
}

export default function Sidebar({ tab, setTab }: SidebarProps) {
  const { profile, produits, demandes } = useStock();

  const role     = profile?.role ?? '';
  const dept     = profile?.dept ?? '';
  const isAdmin  = role === 'Administrateur';
  const canSeeIT  = isAdmin || role === 'Support IT'           || role === 'Utilisateur IT'      || dept === 'both';
  const canSeeFin = isAdmin || role === 'Responsable Finance'  || role === 'Utilisateur Finance' || dept === 'both';
  const canManIT  = isAdmin || role === 'Support IT';
  const canManFin = isAdmin || role === 'Responsable Finance';
  const canHist   = isAdmin || canManIT || canManFin;

  const alertsIT  = produits.filter(p => p.dept === 'IT'      && p.stock <= p.seuil).length;
  const alertsFin = produits.filter(p => p.dept === 'Finance' && p.stock <= p.seuil).length;
  const waitIT    = demandes.filter(d => d.dept === 'IT'      && d.statut === 'En attente').length;
  const waitFin   = demandes.filter(d => d.dept === 'Finance' && d.statut === 'En attente').length;

  const deptLabel = dept === 'IT' ? { label: 'Département IT', bg: 'rgba(79,70,229,.2)', color: '#a5b4fc', border: 'rgba(79,70,229,.3)' }
    : dept === 'Finance' ? { label: 'Département Finance', bg: 'rgba(16,185,129,.18)', color: '#6ee7b7', border: 'rgba(16,185,129,.3)' }
    : { label: 'Administrateur', bg: 'rgba(124,58,237,.2)', color: '#c4b5fd', border: 'rgba(124,58,237,.3)' };

  return (
    <div style={{ width: 234, background: '#1e293b', display: 'flex', flexDirection: 'column', height: '100vh', flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#00c9a7,#009e84)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Package size={16} color="#fff" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc' }}>Connecteo</div>
          <div style={{ fontSize: 9, color: '#64748b', letterSpacing: '.08em', textTransform: 'uppercase', marginTop: 1 }}>Stock v5.0</div>
        </div>
      </div>

      {/* Dept banner */}
      <div style={{ margin: '10px 10px 2px', borderRadius: 8, padding: '8px 12px', fontSize: 11, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 7, background: deptLabel.bg, color: deptLabel.color, border: `1px solid ${deptLabel.border}` }}>
        {deptLabel.label}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '6px 8px', overflowY: 'auto' }}>
        {(isAdmin || (canSeeIT && canSeeFin)) && (
          <>
            <NavSection label="VUE GÉNÉRALE" />
            <NavItem icon={<LayoutDashboard size={15} />} label="Dashboard" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
          </>
        )}

        {canSeeIT && (
          <>
            <NavSection label="STOCK IT" />
            <NavItem icon={<Package size={15} />} label="Inventaire IT" active={tab === 'stock-it'} onClick={() => setTab('stock-it')} />
            {canManIT && <NavItem icon={<ArrowLeftRight size={15} />} label="Mouvements IT" active={tab === 'mvt-it'} onClick={() => setTab('mvt-it')} />}
            <NavItem icon={<ClipboardList size={15} />} label="Demandes IT" badge={canManIT ? waitIT : 0} active={tab === 'dem-it'} onClick={() => setTab('dem-it')} />
            {canManIT && <NavItem icon={<Bell size={15} />} label="Alertes IT" badge={alertsIT} badgeColor="#ef4444" active={tab === 'alertes-it'} onClick={() => setTab('alertes-it')} />}
          </>
        )}

        {canSeeFin && (
          <>
            <NavSection label="STOCK FINANCE" />
            <NavItem icon={<Package size={15} />} label="Inventaire Finance" active={tab === 'stock-fin'} onClick={() => setTab('stock-fin')} />
            {canManFin && <NavItem icon={<ArrowLeftRight size={15} />} label="Mouvements Finance" active={tab === 'mvt-fin'} onClick={() => setTab('mvt-fin')} />}
            <NavItem icon={<ClipboardList size={15} />} label="Demandes Finance" badge={canManFin ? waitFin : 0} active={tab === 'dem-fin'} onClick={() => setTab('dem-fin')} />
            {canManFin && <NavItem icon={<Bell size={15} />} label="Alertes Finance" badge={alertsFin} badgeColor="#ef4444" active={tab === 'alertes-fin'} onClick={() => setTab('alertes-fin')} />}
          </>
        )}

        {canHist && (
          <>
            <NavSection label="ANALYSE" />
            <NavItem icon={<History size={15} />} label="Historique" active={tab === 'historique'} onClick={() => setTab('historique')} />
            <NavItem icon={<BarChart3 size={15} />} label="Rapports" active={tab === 'rapports'} onClick={() => setTab('rapports')} />
          </>
        )}

        {isAdmin && (
          <>
            <NavSection label="ADMINISTRATION" />
            <NavItem icon={<Users size={15} />} label="Utilisateurs" active={tab === 'utilisateurs'} onClick={() => setTab('utilisateurs')} />
            <NavItem icon={<Settings size={15} />} label="Paramètres" active={tab === 'params'} onClick={() => setTab('params')} />
          </>
        )}
      </nav>

      {/* Footer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: profile?.color ?? '#00c9a7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {profile?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.name}</div>
            <div style={{ fontSize: 9.5, color: '#64748b' }}>{profile?.role}</div>
          </div>
          <button
            onClick={() => supabase.auth.signOut()}
            title="Déconnexion"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, borderRadius: 5, transition: '.12s', display: 'flex' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
            onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavSection({ label }: { label: string }) {
  return <div style={{ fontSize: 9, fontWeight: 700, color: '#475569', letterSpacing: '.1em', textTransform: 'uppercase', padding: '14px 10px 5px' }}>{label}</div>;
}

function NavItem({ icon, label, active, onClick, badge = 0, badgeColor = '#f59e0b' }: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void; badge?: number; badgeColor?: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
        borderRadius: 8, cursor: 'pointer', fontSize: 12.5, fontWeight: 500,
        color: active ? '#fff' : '#94a3b8', marginBottom: 1,
        background: active ? 'linear-gradient(135deg,rgba(0,201,167,.22),rgba(0,201,167,.08))' : 'transparent',
        border: active ? '1px solid rgba(0,201,167,.25)' : '1px solid transparent',
        transition: 'all .12s', userSelect: 'none',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.color = '#cbd5e1'; e.currentTarget.style.background = 'rgba(255,255,255,.05)'; } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'transparent'; } }}
    >
      <span style={{ color: active ? '#00c9a7' : undefined, flexShrink: 0 }}>{icon}</span>
      {label}
      {badge > 0 && (
        <span style={{ marginLeft: 'auto', background: badgeColor, color: '#fff', borderRadius: 20, fontSize: 8.5, fontWeight: 700, padding: '1px 6px', lineHeight: 1.7 }}>
          {badge}
        </span>
      )}
    </div>
  );
}