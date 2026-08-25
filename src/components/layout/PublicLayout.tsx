import { Outlet, Link, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'sonner';
import logo from '../../assets/OBC.png';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <ScrollRestoration />
      <div className="flex flex-col bg-white">
        {/* Lien d'accessibilité */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 rounded z-50">
          Aller au contenu principal
        </a>

        {/* Header responsive */}
        <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50 flex-shrink-0">
          <div className="container mx-auto px-4 py-2 md:py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-lg p-1 transition-all hover:opacity-80">
              <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg md:rounded-xl flex-shrink-0">
                <img src={logo} alt="Logo OBC" className="h-7 md:h-10 w-auto" />
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-sm text-gray-600 hover:text-primary transition-colors font-medium"
              >
                Connexion
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                to="/inscription/joueur" 
                className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
              >
                S'inscrire
              </Link>
            </div>

            {/* Navigation - Mobile (hamburger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Menu mobile déroulant */}
          <div className={cn(
            'md:hidden bg-white border-t border-gray-100 px-4 py-3 transition-all duration-200 overflow-hidden',
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 p-0 border-0'
          )}>
            <Link 
              to="/login" 
              className="block w-full text-center text-gray-700 hover:text-primary font-medium py-2.5 px-4 rounded-lg hover:bg-primary/5 transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connexion
            </Link>
            <Link 
              to="/inscription/joueur" 
              className="block w-full text-center bg-primary text-white font-medium py-2.5 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
              onClick={() => setMobileMenuOpen(false)}
            >
              S'inscrire
            </Link>
          </div>
        </header>

        {/* Contenu principal */}
        <main id="main-content" className="flex-1 flex min-h-screen min-w-screen items-center justify-center p-4 sm:p-6 md:p-10 bg-gradient-to-br from-white via-white to-secondary">
          <div className="w-full">
            <Outlet />
          </div>
        </main>

        {/* <Footer /> */}
        <Toaster position="top-right" richColors closeButton />
      </div>
    </>
    
  );
}