'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Database } from 'lucide-react';

export default function LoginScreen() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [showPwd, setShowPwd]     = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Veuillez saisir votre e-mail'); return; }
    if (!password)      { toast.error('Veuillez saisir votre mot de passe'); return; }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      const msgs: Record<string, string> = {
        'Invalid login credentials': 'E-mail ou mot de passe incorrect.',
        'Email not confirmed':       'Veuillez confirmer votre e-mail avant de continuer.',
        'Too many requests':         'Trop de tentatives. Réessayez dans quelques minutes.',
      };
      toast.error(msgs[error.message] ?? error.message);
    }
    // Si succès : onAuthStateChange dans useStock prend le relais
    setLoading(false);
  };

  const handleForgot = async () => {
    if (!email.trim()) { toast.info('Saisissez votre e-mail ci-dessus d\'abord'); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : '',
    });
    if (error) toast.error(error.message);
    else toast.success(`Lien envoyé à ${email.trim()}. Vérifiez vos spams.`);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64,
            background: 'linear-gradient(135deg,#00c9a7,#009e84)',
            borderRadius: 16, display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 14, boxShadow: '0 8px 24px rgba(0,201,167,.35)',
          }}>
            <span style={{ fontSize: 30 }}>📦</span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>Connecteo Stock</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
            Système de gestion des stocks — v5.0
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
              Adresse e-mail professionnelle
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="vous@connecteo.mg"
                autoComplete="username"
                style={{
                  width: '100%', padding: '10px 11px 10px 36px',
                  borderRadius: 9, border: '1.5px solid #e2e8f0',
                  fontSize: 13, fontFamily: 'inherit', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#00c9a7'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', marginBottom: 5 }}>
              Mot de passe
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '10px 40px 10px 36px',
                  borderRadius: 9, border: '1.5px solid #e2e8f0',
                  fontSize: 13, fontFamily: 'inherit', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = '#00c9a7'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px 6px' }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
            <button
              type="button"
              onClick={handleForgot}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#00c9a7', fontWeight: 600, fontFamily: 'inherit' }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: 13,
              background: 'linear-gradient(135deg,#00c9a7,#009e84)',
              color: '#fff', border: 'none', borderRadius: 10,
              fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: loading ? .65 : 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? 'Connexion en cours…' : '→ Se connecter'}
          </button>
        </form>

        {/* Footer */}
        <div style={{ marginTop: 22, textAlign: 'center', fontSize: 11, color: '#94a3b8' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <ShieldCheck size={11} style={{ color: '#00c9a7' }} /> JWT sécurisé
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Database size={11} style={{ color: '#00c9a7' }} /> RLS activé
            </span>
          </div>
          Connecteo · <strong style={{ color: '#475569' }}>© 2026</strong> · Accès réservé
        </div>
      </div>
    </div>
  );
}