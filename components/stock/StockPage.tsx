// components/stock/StockPage.tsx
'use client';

import { useStock } from '@/hooks/useStock';
import ProductTable from './ProductTable';

interface StockPageProps {
  dept: 'IT' | 'Finance';
}

export default function StockPage({ dept }: StockPageProps) {
  const { produits } = useStock();
  const filteredProducts = produits.filter(p => p.dept === dept);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Inventaire {dept}</h2>
          <p className="text-gray-600">{filteredProducts.length} produits référencés</p>
        </div>
        <button 
          onClick={() => alert('Fonction "Ajouter produit" à implémenter')}
          className="bg-teal-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-teal-700 transition"
        >
          + Nouveau Produit
        </button>
      </div>

      <ProductTable products={filteredProducts} dept={dept} />
    </div>
  );
}