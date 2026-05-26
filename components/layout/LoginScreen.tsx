// components/layout/LoginScreen.tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message === 'Invalid login credentials' 
        ? "Email ou mot de passe incorrect" 
        : error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-3xl">📦</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Connecteo Stock</h1>
          <p className="text-sm text-gray-500 mt-1">Gestion de Stock - Call Center</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@connecteo.mg"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3.5 rounded-xl font-semibold hover:brightness-105 transition disabled:opacity-70"
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="text-center text-xs text-gray-400 mt-8">
          Connecteo © 2026 • Accès réservé
        </div>
      </div>
    </div>
  );
}