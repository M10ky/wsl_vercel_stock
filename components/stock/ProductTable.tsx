// components/stock/ProductTable.tsx
'use client';

import type { Product } from '@/types';

interface ProductTableProps {
  products: Product[];
  dept: 'IT' | 'Finance';
}

export default function ProductTable({ products, dept }: ProductTableProps) {
  const color = dept === 'IT' ? 'indigo' : 'emerald';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">ID</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Produit</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Catégorie</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Stock</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Seuil</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Prix Unitaire</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500">Valeur Totale</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isCritical = product.stock <= product.seuil;
            const totalValue = product.stock * product.prix;

            return (
              <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-mono text-sm text-gray-500">{product.id}</td>
                <td className="px-6 py-4 font-medium">{product.nom}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                    {product.categorie}
                  </span>
                </td>
                <td className={`px-6 py-4 font-bold ${isCritical ? 'text-red-600' : 'text-emerald-600'}`}>
                  {product.stock}
                </td>
                <td className="px-6 py-4 text-gray-500">{product.seuil}</td>
                <td className="px-6 py-4 text-gray-700">{product.prix.toLocaleString('fr-FR')} MGA</td>
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {totalValue.toLocaleString('fr-FR')} MGA
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <div className="p-12 text-center text-gray-400">
          Aucun produit trouvé dans ce département
        </div>
      )}
    </div>
  );
}