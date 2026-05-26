// components/layout/Topbar.tsx
'use client';

import { Calendar, Filter } from 'lucide-react';
import { useState } from 'react';

interface TopbarProps {
  tab: string;
}

export default function Topbar({ tab }: TopbarProps) {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const labels: Record<string, string> = {
    dashboard: 'Tableau de Bord',
    'stock-it': 'Inventaire IT',
    'stock-fin': 'Inventaire Finance',
    'mvt-it': 'Mouvements IT',
    'mvt-fin': 'Mouvements Finance',
    'dem-it': 'Demandes IT',
    'dem-fin': 'Demandes Finance',
    'alertes-it': 'Alertes IT',
    'alertes-fin': 'Alertes Finance',
    historique: 'Historique Complet',
    rapports: 'Rapports & Statistiques',
  };

  return (
    <div className="h-16 bg-white border-b flex items-center px-8 justify-between">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{labels[tab] || tab}</h1>
        <p className="text-sm text-gray-500">Connecteo Stock Management</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-50 border rounded-2xl px-4 py-2">
          <Calendar size={18} className="text-teal-600" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-transparent text-sm outline-none w-32"
          />
          <span className="text-gray-400">→</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-transparent text-sm outline-none w-32"
          />
          <button className="ml-2 px-4 py-1 bg-teal-600 text-white text-sm rounded-xl hover:bg-teal-700 transition">
            Filtrer
          </button>
        </div>

        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
          <span className="text-xs font-bold">RT</span>
        </div>
      </div>
    </div>
  );
}