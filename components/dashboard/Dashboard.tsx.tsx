// components/dashboard/Dashboard.tsx
'use client';

import { useStock } from '@/hooks/useStock';
import { Package, AlertTriangle, Clock } from 'lucide-react';

export default function Dashboard() {
  const { produits, profile } = useStock();

  const itProducts = produits.filter(p => p.dept === 'IT');
  const finProducts = produits.filter(p => p.dept === 'Finance');

  const totalValueIT = itProducts.reduce((sum, p) => sum + p.stock * p.prix, 0);
  const totalValueFin = finProducts.reduce((sum, p) => sum + p.stock * p.prix, 0);

  const criticalIT = itProducts.filter(p => p.stock <= p.seuil);
  const criticalFin = finProducts.filter(p => p.stock <= p.seuil);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-1">Bienvenue, {profile?.name}</h2>
        <p className="text-gray-600">Voici l’état de vos stocks en temps réel</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
              💻
            </div>
            <div>
              <p className="text-sm text-gray-500">Valeur Stock IT</p>
              <p className="text-3xl font-bold">{totalValueIT.toLocaleString('fr-FR')} MGA</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              📋
            </div>
            <div>
              <p className="text-sm text-gray-500">Valeur Stock Finance</p>
              <p className="text-3xl font-bold">{totalValueFin.toLocaleString('fr-FR')} MGA</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alertes IT</p>
              <p className="text-3xl font-bold text-amber-600">{criticalIT.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alertes Finance</p>
              <p className="text-3xl font-bold text-rose-600">{criticalFin.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 py-12 border border-dashed border-gray-200 rounded-3xl">
        Graphiques et activités récentes seront ajoutés dans la prochaine étape
      </div>
    </div>
  );
}