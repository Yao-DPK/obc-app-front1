// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useAuth } from '../../hooks/useAuth';
import { Toaster } from 'sonner';

export function Layout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-primary/5">
      <Header />
      <div className="flex flex-1 pt-16"> {/* Supprimer overflow-hidden */}
        {user && <Sidebar />}
        <main
          id="main-content"
          className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-4rem)]" /* Hauteur calculée pour le scroll */
        >
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}