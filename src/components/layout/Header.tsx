// src/components/layout/Header.tsx
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, Crown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import logo from '../../assets/OBC.png';

export function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Déterminer l'icône de rôle
  const RoleIcon = () => {
    if (user?.role === 'super_admin') return <Crown size={14} className="text-yellow-300" />;
    if (user?.role === 'admin') return <Shield size={14} className="text-blue-300" />;
    return null;
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src={logo} alt="LOGO OBC" className="h-10 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="hover:text-secondary transition">
            Dashboard
          </Link>
          <Link to="/documents" className="hover:text-secondary transition">
            Documents
          </Link>
          <Link to="/payments" className="hover:text-secondary transition">
            Paiements
          </Link>
          {user?.role === 'parent' && (
            <Link to="/children" className="hover:text-secondary transition">
              Mes enfants
            </Link>
          )}
          {(user?.role === 'admin' || user?.role === 'super_admin') && (
            <Link to="/admin" className="hover:text-secondary transition">
              Administration
            </Link>
          )}
          {user?.role === 'super_admin' && (
            <Link to="/super-admin/stats" className="hover:text-secondary transition">
              Super Admin
            </Link>
          )}
        </nav>

        {/* User menu & mobile toggle */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                <User size={16} />
                <span className="text-sm">{user.email?.split('@')[0]}</span>
                <RoleIcon />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:bg-white/20"
              >
                <LogOut size={16} className="mr-1" />
                Déconnexion
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="bg-secondary text-primary hover:bg-secondary/90">
                Connexion
              </Button>
            </Link>
          )}
          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-sm px-4 pb-4 pt-2 border-t border-white/20">
          <nav className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-secondary"
            >
              Dashboard
            </Link>
            <Link
              to="/documents"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-secondary"
            >
              Documents
            </Link>
            <Link
              to="/payments"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 hover:text-secondary"
            >
              Paiements
            </Link>
            {user?.role === 'parent' && (
              <Link
                to="/children"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-secondary"
              >
                Mes enfants
              </Link>
            )}
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-secondary"
              >
                Administration
              </Link>
            )}
            {user?.role === 'super_admin' && (
              <Link
                to="/super-admin/stats"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-secondary"
              >
                Super Admin
              </Link>
            )}
            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-red-300 hover:text-red-200"
              >
                Déconnexion
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}