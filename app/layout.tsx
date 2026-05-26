// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';   // FIX: sonner est maintenant dans les dépendances

export const metadata: Metadata = {
  title: 'Connecteo Stock',
  description: 'Système de Gestion de Stock — v5.0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}