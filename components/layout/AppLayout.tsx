// components/layout/AppLayout.tsx
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Dashboard from '@/components/dashboard/Dashboard';
import StockPage from '@/components/stock/StockPage';

export default function AppLayout() {
  const [tab, setTab] = useState('dashboard');

  const renderContent = () => {
    switch (tab) {
      case 'dashboard':
        return <Dashboard />;
      case 'stock-it':
      case 'stock-fin':
        return <StockPage dept={tab === 'stock-it' ? 'IT' : 'Finance'} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-400 py-20">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <p className="text-xl">Page en cours de développement</p>
              <p className="text-sm mt-2">Module : {tab}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar tab={tab} setTab={setTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar tab={tab} />
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}