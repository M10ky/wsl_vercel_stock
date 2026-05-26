'use client';
import { useStock } from '@/hooks/useStock';

export default function MouvementsPage({ dept }: { dept: 'IT' | 'Finance' }) {
  const { mouvements } = useStock();
  const mvt = mouvements.filter(m => m.dept === dept);
  const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));

  return (
    <div>
      <p style={{ fontSize:17, fontWeight:800, color:'#0f172a', marginBottom:3 }}>Mouvements {dept}</p>
      <p style={{ fontSize:11.5, color:'#94a3b8', marginBottom:16 }}>{mvt.length} mouvement(s)</p>
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead>
              <tr>{['ID','Date','Type','Produit','Qté','Valeur','Destination','Agent','Observation'].map(h=>(
                <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'.06em', textTransform:'uppercase', borderBottom:'1.5px solid #e2e8f0', background:'#f8fafc', whiteSpace:'nowrap' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {mvt.length===0 ? <tr><td colSpan={9} style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>Aucun mouvement</td></tr>
              : mvt.map(m=>(
                <tr key={m.id} style={{ borderBottom:'1px solid #e2e8f0' }}>
                  <td style={{ padding:'9px 12px' }}><code style={{ fontFamily:'monospace', fontSize:10, background:'#f1f5f9', padding:'1px 5px', borderRadius:4, color:'#475569' }}>{m.id}</code></td>
                  <td style={{ padding:'9px 12px', fontSize:11, color:'#94a3b8' }}>{m.date}</td>
                  <td style={{ padding:'9px 12px' }}><span style={{ padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700, color: m.type==='Entrée'?'#166534':'#991b1b', background: m.type==='Entrée'?'#dcfce7':'#fee2e2' }}>{m.type==='Entrée'?'↓ Entrée':'↑ Sortie'}</span></td>
                  <td style={{ padding:'9px 12px', fontWeight:500 }}>{m.produit_nom}</td>
                  <td style={{ padding:'9px 12px', fontWeight:700 }}>{m.qty}</td>
                  <td style={{ padding:'9px 12px' }}>{fmt(m.valeur)} MGA</td>
                  <td style={{ padding:'9px 12px', fontSize:11, color:'#475569' }}>{m.destination||'—'}</td>
                  <td style={{ padding:'9px 12px', fontSize:11, color:'#94a3b8' }}>{m.user_name}</td>
                  <td style={{ padding:'9px 12px', fontSize:11, color:'#94a3b8', maxWidth:140 }}>{m.observation||''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
EOF

# DemandesPage
cat > /home/claude/connecteo-stock/components/stock/DemandesPage.tsx << 'EOF'
'use client';
import { useStock } from '@/hooks/useStock';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function DemandesPage({ dept }: { dept: 'IT' | 'Finance' }) {
  const { demandes, produits, profile, loadDemandes, loadProduits, loadMouvements } = useStock();
  const dem   = demandes.filter(d => d.dept === dept);
  const role  = profile?.role ?? '';
  const canMan = role === 'Administrateur' || (dept==='IT' && role==='Support IT') || (dept==='Finance' && role==='Responsable Finance');
  const color  = dept === 'IT' ? '#4f46e5' : '#10b981';

  const validDem = async (id: string, action: 'Validé'|'Refusé') => {
    const d = dem.find(x => x.id === id);
    if (!d) return;
    if (action === 'Validé') {
      const prod = produits.find(p => p.nom === d.produit && p.dept === dept);
      if (!prod || prod.stock < d.qty) { toast.error('Stock insuffisant'); return; }
      const today = new Date().toISOString().split('T')[0];
      const mvtId = `${dept==='IT'?'MVT-IT':'MVT-FIN'}-${Date.now().toString(36).toUpperCase()}`;
      await supabase.from('produits').update({ stock: prod.stock - d.qty, updated_at: new Date().toISOString() }).eq('id', prod.id);
      await supabase.from('mouvements').insert({ id: mvtId, date: today, type: 'Sortie', produit_id: prod.id, produit_nom: prod.nom, qty: d.qty, valeur: d.qty * prod.prix, dept, user_name: profile?.name ?? 'Système', destination: d.dest ?? '', observation: `Validation ${id} — ${d.demandeur}` });
    }
    const { error } = await supabase.from('demandes').update({ statut: action, valideur: profile?.name ?? '', valideur_id: profile?.id, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success(action === 'Validé' ? 'Demande validée' : 'Demande refusée'); await Promise.all([loadDemandes(), loadProduits(), loadMouvements()]); }
  };

  const submitDem = async () => {
    const prod = prompt('Produit demandé:') ?? '';
    if (!prod) return;
    const qty = parseInt(prompt('Quantité:', '1') ?? '1');
    const dest = prompt('Destination:') ?? '';
    const motif = prompt('Motif / Justification:') ?? '';
    if (!dest || !motif) { toast.error('Destination et motif requis'); return; }
    const id = `${dept==='IT'?'DEM-IT':'DEM-FIN'}-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from('demandes').insert({ id, date: new Date().toISOString().split('T')[0], demandeur: profile?.name ?? '', demandeur_id: profile?.id, produit: prod, qty, dest, motif, dept, statut: 'En attente' });
    if (error) toast.error(error.message);
    else { toast.success('Demande soumise'); await loadDemandes(); }
  };

  const statBadge = (s: string) => {
    if (s==='Validé') return <span style={{ padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700, color:'#166534', background:'#dcfce7' }}>✓ Validé</span>;
    if (s==='Refusé') return <span style={{ padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700, color:'#991b1b', background:'#fee2e2' }}>✕ Refusé</span>;
    return <span style={{ padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700, color:'#92400e', background:'#fef3c7' }}>⏳ En attente</span>;
  };

  return (
    <div>
      <p style={{ fontSize:17, fontWeight:800, color:'#0f172a', marginBottom:3 }}>Demandes {dept}</p>
      <p style={{ fontSize:11.5, color:'#94a3b8', marginBottom:12 }}>{dem.filter(d=>d.statut==='En attente').length} en attente · {dem.length} total</p>
      <div style={{ marginBottom:12 }}>
        <button onClick={submitDem} style={{ padding:'6px 13px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', background:color, color:'#fff', border:`1.5px solid ${color}`, fontFamily:'inherit' }}>
          + Nouvelle demande
        </button>
      </div>
      <div style={{ background:'#fff', borderRadius:12, border:'1px solid #e2e8f0', overflow:'hidden', boxShadow:'var(--shadow)' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12.5 }}>
            <thead>
              <tr>{['ID','Date','Demandeur','Produit','Qté','Destination','Motif','Statut','Validé par',...(canMan?['Actions']:[])].map(h=>(
                <th key={h} style={{ padding:'9px 12px', textAlign:'left', fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'.06em', textTransform:'uppercase', borderBottom:'1.5px solid #e2e8f0', background:'#f8fafc', whiteSpace:'nowrap' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {dem.length===0 ? <tr><td colSpan={10} style={{ textAlign:'center', padding:40, color:'#94a3b8' }}>Aucune demande</td></tr>
              : dem.map(d=>(
                <tr key={d.id} style={{ borderBottom:'1px solid #e2e8f0' }}>
                  <td style={{ padding:'9px 12px' }}><code style={{ fontFamily:'monospace', fontSize:10, background:'#f1f5f9', padding:'1px 5px', borderRadius:4, color:'#475569' }}>{d.id}</code></td>
                  <td style={{ padding:'9px 12px', fontSize:11, color:'#94a3b8' }}>{d.date}</td>
                  <td style={{ padding:'9px 12px', fontWeight:500 }}>{d.demandeur}</td>
                  <td style={{ padding:'9px 12px', fontWeight:500 }}>{d.produit}</td>
                  <td style={{ padding:'9px 12px', fontWeight:700 }}>{d.qty}</td>
                  <td style={{ padding:'9px 12px', fontSize:11, color:'#475569' }}>{d.dest||'—'}</td>
                  <td style={{ padding:'9px 12px', fontSize:11, color:'#94a3b8', maxWidth:130 }}>{d.motif}</td>
                  <td style={{ padding:'9px 12px' }}>{statBadge(d.statut)}</td>
                  <td style={{ padding:'9px 12px', fontSize:10.5, color:'#94a3b8' }}>{d.valideur||'—'}</td>
                  {canMan && <td style={{ padding:'9px 12px' }}>
                    {d.statut==='En attente' && <div style={{ display:'flex', gap:4 }}>
                      <button onClick={() => validDem(d.id,'Validé')} style={{ padding:'3px 7px', borderRadius:7, fontSize:10.5, fontWeight:600, cursor:'pointer', background:'#10b981', color:'#fff', border:'1.5px solid #10b981', fontFamily:'inherit' }}>✓</button>
                      <button onClick={() => validDem(d.id,'Refusé')} style={{ padding:'3px 7px', borderRadius:7, fontSize:10.5, fontWeight:600, cursor:'pointer', background:'transparent', color:'#ef4444', border:'1.5px solid #ef4444', fontFamily:'inherit' }}>✕</button>
                    </div>}
                  </td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}