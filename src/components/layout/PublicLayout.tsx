// src/components/layout/PublicLayout.tsx
import { Outlet, Link } from 'react-router-dom';
import logo from '../../assets/OBC.png';
import { Toaster } from 'sonner';
import { Footer } from './Footer';

export function PublicLayout() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 rounded z-50">
        Aller au contenu principal
      </a>
      <header className="bg-primary shadow-md sticky top-0 z-50 flex-shrink-0">
        <div className="container mx-auto px-4 py-4 flex justify-center md:justify-start">
          <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary rounded">
            <img src={logo} alt="Logo OBC" className="h-10 w-auto" />
          </Link>
        </div>
      </header>
      <main id="main-content" className="flex-1 flex items-center justify-center p-10 overflow-hidden">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}