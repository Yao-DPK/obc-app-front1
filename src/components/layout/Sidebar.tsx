// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, CreditCard, Users, Shield, UserCircle, Crown, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  // Pour tous les rôles connectés
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['parent', 'player', 'admin', 'super_admin'] },
  { to: '/documents', label: 'Documents', icon: FileText, roles: ['parent', 'player', 'admin', 'super_admin'] },
  { to: '/payments', label: 'Paiements', icon: CreditCard, roles: ['parent', 'player', 'admin', 'super_admin'] },
  { to: '/profile', label: 'Mon profil', icon: UserCircle, roles: ['parent', 'player', 'admin', 'super_admin'] },

  // Parents uniquement
  { to: '/children', label: 'Mes enfants', icon: Users, roles: ['parent'] },

  // Admin classique
  { to: '/admin', label: 'Administration', icon: Shield, roles: ['admin'] },

  // Super Admin
  { to: '/super-admin/admins', label: 'Gérer les admins', icon: UserPlus, roles: ['super_admin'] },
  { to: '/super-admin/stats', label: 'Stats avancées', icon: Crown, roles: ['super_admin'] },
];

export function Sidebar() {
  const { user } = useAuth();

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role as string)
  );

  return (
    <aside className="hidden md:block w-64 bg-white border-r border-secondary/30 shrink-0">
      <nav className="sticky top-20 p-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-foreground hover:bg-primary/10'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}