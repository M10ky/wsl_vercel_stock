'use client';
import { useStock } from '@/hooks/useStock';
import LoginScreen from '@/components/layout/LoginScreen';
import AppLayout from '@/components/layout/AppLayout';

export default function Home() {
  const { profile, loading } = useStock();

  if (loading) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(15,23,42,.85)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 2000,
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 20 }}>
          Connecteo <span style={{ color: '#00c9a7' }}>Stock</span>
        </div>
        <div className="spinner" />
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginTop: 14 }}>
          Vérification de la session…
        </div>
      </div>
    );
  }

  return profile ? <AppLayout /> : <LoginScreen />;
}