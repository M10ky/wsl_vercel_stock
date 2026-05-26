'use client';
import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface TopbarProps {
  tab: string;
  onFilter: (from: string, to: string) => void;
  onClearFilter: () => void;
  dateFrom: string;
  dateTo: string;
}

const LABELS: Record<string, string> = {
  dashboard:    'Tableau de Bord',
  'stock-it':   'Inventaire IT',
  'stock-fin':  'Inventaire Finance',
  'mvt-it':     'Mouvements IT',
  'mvt-fin':    'Mouvements Finance',
  'dem-it':     'Demandes IT',
  'dem-fin':    'Demandes Finance',
  'alertes-it': 'Alertes IT',
  'alertes-fin':'Alertes Finance',
  historique:   'Historique Complet',
  rapports:     'Rapports & Statistiques',
  utilisateurs: 'Gestion des Utilisateurs',
  params:       'Paramètres Système',
};

export default function Topbar({ tab, onFilter, onClearFilter, dateFrom, dateTo }: TopbarProps) {
  const [from, setFrom] = useState(dateFrom);
  const [to, setTo]     = useState(dateTo);

  return (
    <div style={{ height: 54, background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14, flexShrink: 0 }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{LABELS[tab] ?? tab}</div>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Connecteo — Gestion des stocks</div>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Realtime dot */}
        <div title="Temps réel actif" style={{ width: 7, height: 7, borderRadius: '50%', background: '#00c9a7', animation: 'pulse 2s infinite' }} />

        {/* Date filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f1f5f9', border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '5px 11px' }}>
          <Calendar size={14} style={{ color: '#00c9a7' }} />
          <label style={{ fontSize: 10.5, color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 500 }}>Du</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 12, color: '#0f172a', fontFamily: 'inherit', width: 105, outline: 'none' }} />
          <label style={{ fontSize: 10.5, color: '#94a3b8', fontWeight: 500 }}>Au</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)}
            style={{ border: 'none', background: 'transparent', fontSize: 12, color: '#0f172a', fontFamily: 'inherit', width: 105, outline: 'none' }} />
          <button onClick={() => onFilter(from, to)}
            style={{ background: '#00c9a7', color: '#fff', border: 'none', borderRadius: 7, padding: '4px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Filtrer
          </button>
          <button onClick={() => { setFrom(''); setTo(''); onClearFilter(); }}
            style={{ background: 'transparent', color: '#94a3b8', border: '1.5px solid #e2e8f0', borderRadius: 7, padding: '4px 9px', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Tout
          </button>
        </div>
      </div>
    </div>
  );
}