// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import LoginScreen from '@/components/layout/LoginScreen';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-4">Connecteo <span className="text-teal-400">Stock</span></div>
          <div className="spinner mx-auto"></div>
        </div>
      </div>
    );
  }

  return session ? <MainApp /> : <LoginScreen />;
}

// Composant principal de l'application (on va le simplifier)
function MainApp() {
  const [tab, setTab] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar simplifiée */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-2xl flex items-center justify-center text-xl">📦</div>
            <div>
              <div className="font-bold text-xl">Connecteo</div>
              <div className="text-xs text-slate-400">Stock Management</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div onClick={() => setTab('dashboard')} className={`px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 ${tab === 'dashboard' ? 'bg-teal-600' : 'hover:bg-white/10'}`}>
            📊 Dashboard
          </div>
          <div onClick={() => setTab('stock-it')} className={`px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 ${tab === 'stock-it' ? 'bg-teal-600' : 'hover:bg-white/10'}`}>
            💻 Stock IT
          </div>
          <div onClick={() => setTab('stock-fin')} className={`px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 ${tab === 'stock-fin' ? 'bg-teal-600' : 'hover:bg-white/10'}`}>
            📁 Stock Finance
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full py-3 text-red-400 hover:bg-red-950/50 rounded-xl text-sm font-medium"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-auto bg-slate-50 p-8">
        {tab === 'dashboard' && <h1 className="text-3xl font-bold">Tableau de Bord</h1>}
        {tab === 'stock-it' && <h1 className="text-3xl font-bold">Stock IT</h1>}
        {tab === 'stock-fin' && <h1 className="text-3xl font-bold">Stock Finance</h1>}
      </div>
    </div>
  );
}
