// hooks/useStock.ts
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, Product, Mouvement, Demande } from '@/types';

export function useStock() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [produits, setProduits] = useState<Product[]>([]);
  const [mouvements, setMouvements] = useState<Mouvement[]>([]);
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
  };

  const loadAllData = async () => {
    const [pRes, mRes, dRes] = await Promise.all([
      supabase.from('produits').select('*').order('nom'),
      supabase.from('mouvements').select('*').order('created_at', { ascending: false }),
      supabase.from('demandes').select('*').order('created_at', { ascending: false }),
    ]);

    setProduits(pRes.data || []);
    setMouvements(mRes.data || []);
    setDemandes(dRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadProfile(session.user.id);
        await loadAllData();
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  return { profile, produits, mouvements, demandes, loading };
}