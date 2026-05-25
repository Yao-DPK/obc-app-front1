// src/components/layout/Sidebar.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, CreditCard, Users, Shield, 
  UserCircle, Crown, UserPlus, ChevronLeft, ChevronRight, LogOut 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Button } from '../ui/button';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['parent', 'player', 'admin', 'super_admin'] },
  //{ to: '/documents', label: 'Documents', icon: FileText, roles: ['parent', 'player', 'admin', 'super_admin'] },
  //{ to: '/payments', label: 'Paiements', icon: CreditCard, roles: ['parent', 'player', 'admin', 'super_admin'] },
  //{ to: '/profile', label: 'Mon profil', icon: UserCircle, roles: ['parent', 'player', 'admin', 'super_admin'] },
  //{ to: '/children', label: 'Mes enfants', icon: Users, roles: ['parent'] },
  //{ to: '/admin', label: 'Administration', icon: Shield, roles: ['admin'] },
  { to: '/super-admin/admins', label: 'Gérer les admins', icon: UserPlus, roles: ['super_admin'] },
  { to: '/super-admin/stats', label: 'Stats avancées', icon: Crown, roles: ['super_admin'] },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role as string)
  );

  const getInitials = () => {
    const first = user?.firstName?.charAt(0) || '';
    const last = user?.lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={`hidden md:flex flex-col bg-white border-r border-secondary/30 shrink-0 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Bouton de réduction */}
        <div className="flex justify-end p-2 border-b border-secondary/20">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Profil utilisateur (visible uniquement en mode normal) */}
        {!isCollapsed && user && (
          <div className="flex items-center gap-3 p-4 border-b border-secondary/20 mb-2">
            <Avatar className="h-10 w-10 bg-secondary text-primary">
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.role === 'super_admin' ? 'Super Admin' : 
                 user.role === 'admin' ? 'Admin' : 
                 user.role === 'parent' ? 'Parent' : 'Joueur'}
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredItems.map((item) => (
            <Tooltip key={item.to}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'text-foreground hover:bg-primary/10'
                    } ${isCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <item.icon size={20} className="shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right" className="text-sm">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>

        {/* Déconnexion en bas (seulement en mode normal) */}
        {!isCollapsed && user && (
          <div className="p-3 border-t border-secondary/20 mt-auto">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" />
              Déconnexion
            </Button>
          </div>
        )}
        {isCollapsed && user && (
          <div className="p-2 border-t border-secondary/20 mt-auto flex justify-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600"
                  onClick={logout}
                >
                  <LogOut size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Déconnexion</TooltipContent>
            </Tooltip>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}