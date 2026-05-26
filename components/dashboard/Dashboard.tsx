'use client';
import { useStock } from '@/hooks/useStock';
import { AlertTriangle, TrendingUp, Package, Clock } from 'lucide-react';

export default function Dashboard() {
  const { produits, mouvements, demandes, profile } = useStock();

  const role     = profile?.role ?? '';
  const isAdmin  = role === 'Administrateur';
  const dept     = profile?.dept ?? '';
  const canSeeIT  = isAdmin || role === 'Support IT'           || role === 'Utilisateur IT'      || dept === 'both';
  const canSeeFin = isAdmin || role === 'Responsable Finance'  || role === 'Utilisateur Finance' || dept === 'both';

  const itProds  = produits.filter(p => p.dept === 'IT');
  const finProds = produits.filter(p => p.dept === 'Finance');
  const vIT      = itProds.reduce((s, p) => s + p.stock * p.prix, 0);
  const vFin     = finProds.reduce((s, p) => s + p.stock * p.prix, 0);
  const alIT     = itProds.filter(p => p.stock <= p.seuil).length;
  const alFin    = finProds.filter(p => p.stock <= p.seuil).length;
  const waitIT   = demandes.filter(d => d.dept === 'IT'      && d.statut === 'En attente').length;
  const waitFin  = demandes.filter(d => d.dept === 'Finance' && d.statut === 'En attente').length;

  const recent = [...mouvements].sort((a, b) =>
    new Date(b.created_at ?? b.date).getTime() - new Date(a.created_at ?? a.date).getTime()
  ).slice(0, 8);

  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));

  const kpis = [
    ...(canSeeIT  ? [{ lbl: 'Valeur Stock IT',            val: `${fmt(vIT)} MGA`,  sub: `${itProds.length} réf.`,   c: '#4f46e5', icon: <Package size={18} /> }] : []),
    ...(canSeeFin ? [{ lbl: 'Valeur Stock Finance',        val: `${fmt(vFin)} MGA`, sub: `${finProds.length} réf.`,  c: '#10b981', icon: <TrendingUp size={18} /> }] : []),
    ...(canSeeIT  ? [{ lbl: 'Alertes IT',                  val: alIT,               sub: alIT  > 0 ? '⚠ à traiter' : '✓ OK', c: alIT  > 0 ? '#ef4444' : '#22c55e', icon: <AlertTriangle size={18} /> }] : []),
    ...(canSeeFin ? [{ lbl: 'Alertes Finance',             val: alFin,              sub: alFin > 0 ? '⚠ à traiter' : '✓ OK', c: alFin > 0 ? '#ef4444' : '#22c55e', icon: <AlertTriangle size={18} /> }] : []),
    ...(canSeeIT  ? [{ lbl: 'Demandes IT en attente',      val: waitIT,             sub: 'à traiter', c: '#f59e0b', icon: <Clock size={18} /> }] : []),
    ...(canSeeFin ? [{ lbl: 'Demandes Finance en attente', val: waitFin,            sub: 'à traiter', c: '#f59e0b', icon: <Clock size={18} /> }] : []),
  ];

  return (
    <div>
      <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>Tableau de Bord</p>
      <p style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 16 }}>
        Vue d&apos;ensemble en temps réel — {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 11, marginBottom: 20 }}>
        {kpis.map(k => (
          <div key={k.lbl} style={{ background: '#fff', borderRadius: 12, padding: '14px 16px', border: '1px solid #e2e8f0', borderLeft: `3px solid ${k.c}`, boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 7 }}>{k.lbl}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{k.val}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 5 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, fontSize: 13, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ color: '#00c9a7' }}>●</span> Activités récentes
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr>
                {['Date', 'Dépt', 'Type', 'Produit', 'Qté', 'Destination', 'Agent'].map(h => (
                  <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: '1.5px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 20, color: '#94a3b8' }}>Aucun mouvement sur la période</td></tr>
              ) : recent.map(m => (
                <tr key={m.id}>
                  <td style={{ padding: '9px 12px', fontSize: 11, color: '#94a3b8', borderBottom: '1px solid #e2e8f0' }}>{m.date}</td>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, color: m.dept === 'IT' ? '#3730a3' : '#065f46', background: m.dept === 'IT' ? '#e0e7ff' : '#d1fae5' }}>{m.dept}</span>
                  </td>
                  <td style={{ padding: '9px 12px', borderBottom: '1px solid #e2e8f0' }}>
                    <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700, color: m.type === 'Entrée' ? '#166534' : '#991b1b', background: m.type === 'Entrée' ? '#dcfce7' : '#fee2e2' }}>{m.type === 'Entrée' ? '↓ Entrée' : '↑ Sortie'}</span>
                  </td>
                  <td style={{ padding: '9px 12px', fontWeight: 500, borderBottom: '1px solid #e2e8f0' }}>{m.produit_nom}</td>
                  <td style={{ padding: '9px 12px', fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>{m.qty}</td>
                  <td style={{ padding: '9px 12px', fontSize: 11, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>{m.destination || '—'}</td>
                  <td style={{ padding: '9px 12px', fontSize: 11, color: '#94a3b8', borderBottom: '1px solid #e2e8f0' }}>{m.user_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}