// src/components/layout/Sidebar.tsx
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../stores/useAuth';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import type { UserRole } from '@/types/user.type';
import { cn } from '@/lib/utils';
import logo from '../../assets/OBC.png';
import { groupedNavItems } from '@/lib/navigation';
import { AdultAvatar } from '../CustomAdultAvatar';

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  if (!user) return null;


  const grouped = groupedNavItems(user.role as UserRole);
  const sectionsTitles: Record<string, string> = {
    principal: 'Navigation',
    gestion: 'Gestion',
    admin: 'Administration',
    parametres: 'Paramètres',
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };



  const allNavItems = Object.values(grouped).flat();

  const handleLogout = async () => {
    await logout();
    navigate('/home');
  };

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-500 h-screen sticky top-0',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Section Logo + réduction (fixe) */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 shrink-0">
        <img src={logo} alt="Logo OBC" className={cn('h-8 w-auto', isCollapsed ? 'mx-auto' : '')} />
        {!isCollapsed && (
          <span className="font-heading text-lg font-bold text-primary truncate flex-1">
            Olympic Basket
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100 rounded-full shrink-0"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Zone de navigation scrollable */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {isCollapsed ? (
          <div className="space-y-2">
            {allNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative flex items-center justify-center rounded-lg p-2.5 transition-all duration-200 group',
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )
                }
              >
                <item.icon size={20} className="shrink-0" />
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </span>
              </NavLink>
            ))}
          </div>
        ) : (
          Object.entries(grouped).map(([section, items]) => {
            const isOpen = openSections[section] ?? true;
            return (
              <Collapsible
                key={section}
                open={isOpen}
                onOpenChange={() => toggleSection(section)}
                className="space-y-1"
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-2 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md"
                  >
                    <span>{sectionsTitles[section] || section}</span>
                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1">
                  {items.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group',
                          isActive
                            ? 'bg-primary/10 text-primary font-medium border-l-4 border-primary'
                            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        )
                      }
                    >
                      <item.icon size={20} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })
        )}
      </nav>

      {/* Section bas : Profil + Déconnexion (fixe) */}
      <div className="border-t border-gray-200 p-3 shrink-0 bg-white">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 mb-2">
            <AdultAvatar photoUrl={user!.photoUrl!} firstName={user!.firstName! || "firstname"} lastName={user.lastName! || "firstname"} sexe={user!.gender! as "M"|"F"}  />
          <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.role === 'super_admin' ? 'Superviseur' :
                 user.role === 'admin' ? 'Administrateur' :
                 user.role === 'parent' ? 'Parent' : 'Joueur'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-2">
            <AdultAvatar photoUrl={user!.photoUrl!} firstName={user!.firstName! || "firstname"} lastName={user.lastName! || "firstname"} sexe={user!.gender! as "M"|"F"}  />
          </div>
        )}
        <Button
          variant="ghost"
          className={cn(
            'text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full',
            isCollapsed ? 'justify-center px-2' : 'justify-start'
          )}
          onClick={handleLogout}
        >
          <LogOut size={18} className={cn(isCollapsed ? '' : 'mr-2')} />
          {!isCollapsed && 'Déconnexion'}
        </Button>
      </div>

    </aside>
  );
}