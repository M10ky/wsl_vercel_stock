'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import LoginScreen from '@/components/layout/LoginScreen';
import AppLayout from '@/components/layout/AppLayout';
import { useStock } from '@/hooks/useStock';

export default function Home() {
  const [session, setSession] = useState<any>(null);
  const { profile, loading } = useStock();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div id="global-loader" className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-white mb-4">Connecteo <span className="text-teal-400">Stock</span></div>
        <div className="spinner"></div>
        <p className="text-white/70 mt-4">Chargement...</p>
      </div>
    );
  }

  return session && profile ? <AppLayout /> : <LoginScreen />;
}