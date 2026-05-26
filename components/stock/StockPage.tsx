'use client';
import { useStock } from '@/hooks/useStock';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface StockPageProps { dept: 'IT' | 'Finance'; }

export default function StockPage({ dept }: StockPageProps) {
  const { produits, params, profile, loadProduits, loadMouvements } = useStock();
  const products = produits.filter(p => p.dept === dept);
  const color    = dept === 'IT' ? '#4f46e5' : '#10b981';
  const role     = profile?.role ?? '';
  const canMan   = role === 'Administrateur' || (dept === 'IT' && role === 'Support IT') || (dept === 'Finance' && role === 'Responsable Finance');
  const cats     = dept === 'IT' ? params.categoriesIT : params.categoriesFin;
  const total    = products.reduce((s, p) => s + p.stock * p.prix, 0);
  const fmt      = (n: number) => new Intl.NumberFormat('fr-FR').format(Math.round(n));

  const getStatus = (p: Product) => p.stock === 0 ? 'Rupture' : p.stock <= p.seuil ? 'Critique' : 'Disponible';
  const statusTag = (s: string) => {
    if (s === 'Rupture') return <span style={{ display:'inline-flex', padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700, color:'#dc2626', background:'#fef2f2' }}>● Rupture</span>;
    if (s === 'Critique') return <span style={{ display:'inline-flex', padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700, color:'#d97706', background:'#fffbeb' }}>▲ Critique</span>;
    return <span style={{ display:'inline-flex', padding:'2px 9px', borderRadius:20, fontSize:10, fontWeight:700, color:'#16a34a', background:'#f0fdf4' }}>✓ Dispo</span>;
  };

  const openMvt = (type: 'Entrée'|'Sortie', prodId?: string) => {
    const prod = prodId ? produits.find(p => p.id === prodId) : null;
    const prodOpts = products.map(p => `${p.id}:${p.nom}:${p.stock}`);
    const destOpts = params.destinations;
    // Simple prompt-based form (modal complet dans une vraie app)
    const prodSel = prodId ?? (prodOpts.length > 0 ? prompt(`Produit (ID). Options:\n${prodOpts.map(o=>o.split(':').slice(0,2).join(' - ')).join('\n')}`, prod?.id ?? '') ?? '' : '');
    const qtyStr  = prompt(`Quantité pour ${type}:`, '1') ?? '';
    const qty     = parseInt(qtyStr);
    if (!prodSel || !qty || qty <= 0) return;
    const selectedProd = produits.find(p => p.id === prodSel);
    if (!selectedProd) { toast.error('Produit introuvable'); return; }
    if (type === 'Sortie' && selectedProd.stock < qty) { toast.error(`Stock insuffisant (${selectedProd.stock} dispo)`); return; }
    const dest = type === 'Sortie' ? (prompt(`Destination:\n${destOpts.join('\n')}`) ?? '') : (prompt('Fournisseur / Réf.') ?? '');
    const obs  = prompt('Observation (optionnel):') ?? '';
    submitMvt(type, selectedProd, qty, dest, obs);
  };

  const submitMvt = async (type: 'Entrée'|'Sortie', prod: Product, qty: number, dest: string, obs: string) => {
    const newStock = type === 'Entrée' ? prod.stock + qty : prod.stock - qty;
    const id = `${dept === 'IT' ? 'MVT-IT' : 'MVT-FIN'}-${Date.now().toString(36).toUpperCase()}`;
    const today = new Date().toISOString().split('T')[0];
    try {
      const { error: e1 } = await supabase.from('produits').update({ stock: newStock, updated_at: new Date().toISOString() }).eq('id', prod.id);
      if (e1) throw e1;
      const { error: e2 } = await supabase.from('mouvements').insert({ id, date: today, type, produit_id: prod.id, produit_nom: prod.nom, qty, valeur: qty * prod.prix, dept, user_name: profile?.name ?? 'Système', user_id: profile?.id, destination: dest, observation: obs });
      if (e2) throw e2;
      toast.success(`${type} enregistrée — ${qty}× ${prod.nom}`);
      await Promise.all([loadProduits(), loadMouvements()]);
    } catch (err: unknown) { toast.error('Erreur: ' + (err instanceof Error ? err.message : String(err))); }
  };

  const openAdd = async () => {
    const nom  = prompt('Nom du produit:') ?? '';
    if (!nom) return;
    const cat  = cats.length > 0 ? (prompt(`Catégorie:\n${cats.join('\n')}`, cats[0]) ?? cats[0]) : (prompt('Catégorie:') ?? '');
    const stk  = parseInt(prompt('Stock initial:', '0') ?? '0');
    const seui = parseInt(prompt('Seuil critique:', '5') ?? '5');
    const prix = parseInt(prompt('Prix unitaire (MGA):', '0') ?? '0');
    if (!nom || !cat) { toast.error('Nom et catégorie requis'); return; }
    const id = `${dept === 'IT' ? 'IT' : 'FIN'}-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from('produits').insert({ id, nom, categorie: cat, dept, stock: stk, seuil: seui, prix });
    if (error) toast.error('Erreur: ' + error.message);
    else { toast.success(`"${nom}" ajouté`); await loadProduits(); }
  };

  return (
    <div>
      <p style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>Inventaire {dept}</p>
      <p style={{ fontSize: 11.5, color: '#94a3b8', marginBottom: 16 }}>Valeur totale: {fmt(total)} MGA</p>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        <div style={{ padding: '13px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontWeight: 700, fontSize: 13 }}>{products.length} références · {fmt(total)} MGA</span>
          {canMan && (
            <div style={{ display: 'flex', gap: 7 }}>
              <Btn label="↓ Entrée" color={color} onClick={() => openMvt('Entrée')} />
              <Btn label="↑ Sortie" color="#ef4444" onClick={() => openMvt('Sortie')} />
              <Btn label="+ Produit" color={color} filled onClick={openAdd} />
            </div>
          )}
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
            <thead>
              <tr>
                {['ID', 'Produit', 'Catégorie', 'Stock', 'Seuil', 'Prix Unit.', 'Valeur', 'Statut', ...(canMan ? ['Actions'] : [])].map(h => (
                  <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '.06em', textTransform: 'uppercase', borderBottom: '1.5px solid #e2e8f0', background: '#f8fafc', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Aucun produit</td></tr>
              ) : products.map(p => {
                const st = getStatus(p);
                const sc = st === 'Rupture' ? '#dc2626' : st === 'Critique' ? '#d97706' : '#0f172a';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '9px 12px' }}><code style={{ fontFamily: 'monospace', fontSize: 10.5, background: '#f1f5f9', padding: '1px 5px', borderRadius: 4, color: '#475569' }}>{p.id}</code></td>
                    <td style={{ padding: '9px 12px', fontWeight: 600 }}>{p.nom}</td>
                    <td style={{ padding: '9px 12px' }}><span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 9px', borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{p.categorie}</span></td>
                    <td style={{ padding: '9px 12px', fontFamily: 'monospace', fontSize: 15, fontWeight: 800, color: sc }}>{p.stock}</td>
                    <td style={{ padding: '9px 12px', color: '#94a3b8' }}>{p.seuil}</td>
                    <td style={{ padding: '9px 12px', color: '#475569' }}>{fmt(p.prix)} MGA</td>
                    <td style={{ padding: '9px 12px', fontWeight: 700 }}>{fmt(p.stock * p.prix)} MGA</td>
                    <td style={{ padding: '9px 12px' }}>{statusTag(st)}</td>
                    {canMan && (
                      <td style={{ padding: '9px 12px' }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <Btn label="+" color={color} onClick={() => openMvt('Entrée', p.id)} small />
                          <Btn label="−" color="#ef4444" onClick={() => openMvt('Sortie', p.id)} small />
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Btn({ label, color, onClick, filled, small }: { label: string; color: string; onClick: () => void; filled?: boolean; small?: boolean }) {
  return (
    <button onClick={onClick} style={{
      padding: small ? '3px 7px' : '6px 13px',
      borderRadius: 7, fontSize: small ? 10.5 : 12, fontWeight: 600, cursor: 'pointer',
      border: `1.5px solid ${color}`,
      background: filled ? color : 'transparent',
      color: filled ? '#fff' : color,
      fontFamily: 'inherit', transition: 'all .12s',
    }}>
      {label}
    </button>
  );
}