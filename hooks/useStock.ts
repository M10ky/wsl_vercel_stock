
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, Product, Mouvement, Demande, Params } from '@/types';

export function useStock() {
  const [profile, setProfile]       = useState<Profile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  const [produits, setProduits]     = useState<Product[]>([]);
  const [mouvements, setMouvements] = useState<Mouvement[]>([]);
  const [demandes, setDemandes]     = useState<Demande[]>([]);
  const [params, setParams]         = useState<Params>({ destinations: [], categoriesIT: [], categoriesFin: [] });
  const [loading, setLoading]       = useState(true);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data && data.is_active) {
      setProfile(data as Profile);
      return data as Profile;
    }
    return null;
  }, []);

  const loadAllProfiles = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').order('name');
    setAllProfiles((data || []) as Profile[]);
  }, []);

  const loadProduits = useCallback(async () => {
    const { data } = await supabase.from('produits').select('*').order('nom');
    setProduits((data || []) as Product[]);
  }, []);

  const loadMouvements = useCallback(async (from?: string, to?: string) => {
    let q = supabase.from('mouvements').select('*').order('created_at', { ascending: false }).limit(500);
    if (from) q = q.gte('date', from);
    if (to)   q = q.lte('date', to);
    const { data } = await q;
    setMouvements((data || []) as Mouvement[]);
  }, []);

  const loadDemandes = useCallback(async (from?: string, to?: string) => {
    let q = supabase.from('demandes').select('*').order('created_at', { ascending: false }).limit(300);
    if (from) q = q.gte('date', from);
    if (to)   q = q.lte('date', to);
    const { data } = await q;
    setDemandes((data || []) as Demande[]);
  }, []);

  const loadParams = useCallback(async () => {
    const { data } = await supabase.from('parametres').select('*').order('valeur');
    const rows = data || [];
    setParams({
      destinations:  rows.filter((r: { cle: string }) => r.cle === 'destinations').map((r: { valeur: string }) => r.valeur),
      categoriesIT:  rows.filter((r: { cle: string }) => r.cle === 'categoriesIT').map((r: { valeur: string }) => r.valeur),
      categoriesFin: rows.filter((r: { cle: string }) => r.cle === 'categoriesFin').map((r: { valeur: string }) => r.valeur),
    });
  }, []);

  const loadAllData = useCallback(async (prof?: Profile) => {
    const p = prof ?? profile;
    const isAdmin = p?.role === 'Administrateur';
    await Promise.all([
      loadProduits(),
      loadMouvements(),
      loadDemandes(),
      loadParams(),
      isAdmin ? loadAllProfiles() : Promise.resolve(),
    ]);
    setLoading(false);
  }, [profile, loadProduits, loadMouvements, loadDemandes, loadParams, loadAllProfiles]);

  // ── FIX: vérifie la session EXISTANTE au montage ─────────────────────────
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && mounted) {
        const prof = await loadProfile(session.user.id);
        if (prof && mounted) await loadAllData(prof);
        else if (mounted) setLoading(false);
      } else if (mounted) {
        setLoading(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'SIGNED_IN' && session?.user) {
        setLoading(true);
        const prof = await loadProfile(session.user.id);
        if (prof && mounted) await loadAllData(prof);
        else if (mounted) setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setAllProfiles([]);
        setProduits([]);
        setMouvements([]);
        setDemandes([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Realtime ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!profile) return;
    const channel = supabase.channel('connecteo-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'produits' },   () => loadProduits())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mouvements' }, () => loadMouvements())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'demandes' },   () => loadDemandes())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'parametres' }, () => loadParams())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [profile, loadProduits, loadMouvements, loadDemandes, loadParams]);

  return {
    profile, allProfiles, produits, mouvements, demandes, params, loading,
    loadProduits, loadMouvements, loadDemandes, loadParams, loadAllProfiles,
  };
}