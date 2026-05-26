'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useStock } from '@/hooks/useStock';
import Dashboard from '@/components/dashboard/Dashboard';
import StockPage from '@/components/stock/StockPage';
import MouvementsPage from '@/components/stock/MouvementsPage';
import DemandesPage from '@/components/stock/DemandesPage';
import AlertesPage from '@/components/stock/AlertesPage';
import HistoriquePage from '@/components/analyse/HistoriquePage';
import RapportsPage from '@/components/analyse/RapportsPage';
import UtilisateursPage from '@/components/admin/UtilisateursPage';
import ParamsPage from '@/components/admin/ParamsPage';

export default function AppLayout() {
  const { profile, loadMouvements, loadDemandes } = useStock();

  const role     = profile?.role ?? '';
  const dept     = profile?.dept ?? '';
  const isAdmin  = role === 'Administrateur';
  const canSeeIT  = isAdmin || role === 'Support IT'           || role === 'Utilisateur IT'      || dept === 'both';
  const canSeeFin = isAdmin || role === 'Responsable Finance'  || role === 'Utilisateur Finance' || dept === 'both';

  const defaultTab = isAdmin || (canSeeIT && canSeeFin)
    ? 'dashboard'
    : canSeeIT ? 'stock-it' : 'stock-fin';

  const [tab, setTab]         = useState(defaultTab);
  const [dateFrom, setDateFrom] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  });
  const [dateTo, setDateTo] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  });

  const handleFilter = async (from: string, to: string) => {
    setDateFrom(from);
    setDateTo(to);
    await Promise.all([loadMouvements(from, to), loadDemandes(from, to)]);
  };

  const handleClear = async () => {
    setDateFrom('');
    setDateTo('');
    await Promise.all([loadMouvements(), loadDemandes()]);
  };

  const AccessDenied = () => (
    <div style={{ textAlign: 'center', padding: '60px 32px', color: '#94a3b8' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>🔒</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>Accès restreint</div>
      <div style={{ fontSize: 12 }}>Vous n&apos;avez pas les droits nécessaires pour cette section.</div>
    </div>
  );

  const renderContent = () => {
    const canManIT  = isAdmin || role === 'Support IT';
    const canManFin = isAdmin || role === 'Responsable Finance';
    const canHist   = isAdmin || canManIT || canManFin;

    switch (tab) {
      case 'dashboard':    return <Dashboard />;
      case 'stock-it':     return canSeeIT  ? <StockPage dept="IT" />      : <AccessDenied />;
      case 'stock-fin':    return canSeeFin ? <StockPage dept="Finance" /> : <AccessDenied />;
      case 'mvt-it':       return canManIT  ? <MouvementsPage dept="IT" />      : <AccessDenied />;
      case 'mvt-fin':      return canManFin ? <MouvementsPage dept="Finance" /> : <AccessDenied />;
      case 'dem-it':       return canSeeIT  ? <DemandesPage dept="IT" />      : <AccessDenied />;
      case 'dem-fin':      return canSeeFin ? <DemandesPage dept="Finance" /> : <AccessDenied />;
      case 'alertes-it':   return canManIT  ? <AlertesPage dept="IT" />      : <AccessDenied />;
      case 'alertes-fin':  return canManFin ? <AlertesPage dept="Finance" /> : <AccessDenied />;
      case 'historique':   return canHist   ? <HistoriquePage dateFrom={dateFrom} dateTo={dateTo} /> : <AccessDenied />;
      case 'rapports':     return canHist   ? <RapportsPage />  : <AccessDenied />;
      case 'utilisateurs': return isAdmin   ? <UtilisateursPage /> : <AccessDenied />;
      case 'params':       return isAdmin   ? <ParamsPage />    : <AccessDenied />;
      default:             return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar tab={tab} setTab={setTab} />
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Topbar tab={tab} onFilter={handleFilter} onClearFilter={handleClear} dateFrom={dateFrom} dateTo={dateTo} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '20px 22px' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}