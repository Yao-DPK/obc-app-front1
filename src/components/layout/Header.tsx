// src/components/layout/Header.tsx
import { Link } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, Crown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import logo from '../../assets/OBC.png';
import { headerNavItems } from '@/lib/navigation';
import type { UserRole } from '@/types/user.type';

export function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navLinks = user ? headerNavItems(user.role as UserRole) : [];


  // Fermer le menu au clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const RoleIcon = () => {
    if (user?.role === 'super_admin') return <Crown size={14} className="text-yellow-300" />;
    if (user?.role === 'admin') return <Shield size={14} className="text-blue-300" />;
    return null;
  };

  return (
    <header className="bg-primary text-white fixed top-0 left-0 right-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-secondary rounded">
          <img src={logo} alt="Logo OBC" className="h-10 w-auto" />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
        {navLinks.map((item) => (
          <NavLink key={item.to} to={item.to}>{item.label}</NavLink>
        ))}
        {/* Lien spécifique pour l'administration (si rôle admin ou super_admin) */}
        {user?.role === 'admin' && <NavLink to="/admin">Administration</NavLink>}
        {user?.role === 'super_admin' && <NavLink to="/super-admin">Super Admin</NavLink>}
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
              <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/20">
                <LogOut size={16} className="mr-1" /> Déconnexion
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button className="bg-secondary text-primary hover:bg-secondary/90">Connexion</Button>
            </Link>
          )}
          <button
            className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-secondary rounded p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-64 bg-primary shadow-xl transform transition-transform duration-300 ease-in-out md:hidden z-50 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 pt-16">
          <nav className="flex flex-col gap-4">
            <MobileNavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</MobileNavLink>
            <MobileNavLink to="/documents" onClick={() => setMobileMenuOpen(false)}>Documents</MobileNavLink>
            <MobileNavLink to="/payments" onClick={() => setMobileMenuOpen(false)}>Paiements</MobileNavLink>
            {user?.role === 'parent' && <MobileNavLink to="/children" onClick={() => setMobileMenuOpen(false)}>Mes enfants</MobileNavLink>}
            {(user?.role === 'admin' || user?.role === 'super_admin') && <MobileNavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Administration</MobileNavLink>}
            {user?.role === 'super_admin' && <MobileNavLink to="/super-admin/stats" onClick={() => setMobileMenuOpen(false)}>Super Admin</MobileNavLink>}
            {user && (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-left py-2 text-red-300 hover:text-red-200 border-t border-white/20 pt-4 mt-2"
              >
                Déconnexion
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

// Composants auxiliaires pour éviter la duplication
function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="hover:text-secondary transition">
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }: { to: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link to={to} onClick={onClick} className="py-2 hover:text-secondary transition">
      {children}
    </Link>
  );
}