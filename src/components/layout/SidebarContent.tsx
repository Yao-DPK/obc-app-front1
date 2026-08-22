// src/components/layout/SidebarContent.tsx
// Ce composant reprend le contenu du Sidebar (navigation + profil) sans les fonctionnalités de collapse
// pour être utilisé dans le Sheet mobile.
import { NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../stores/useAuth';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import type { UserRole } from '@/types/user.type';
import { cn } from '@/lib/utils';
import logo from '@/assets/OBC.png';
import { groupedNavItems } from '@/lib/navigation';
import { useState } from 'react';
import { AdultAvatar } from '../CustomAdultAvatar';

interface SidebarContentProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function SidebarContent({ mobile, onClose }: SidebarContentProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  if (!user) return null;

  const grouped = groupedNavItems(user.role as UserRole);
  const sectionsTitles: Record<string, string> = {
    principal: 'Navigation',
    gestion: 'Gestion des inscriptions',
    admin: 'Administration',
    parametres: 'Paramètres',
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };


  const handleLogout = async () => {
    await logout();
    navigate('/home');
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (mobile && onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Logo + titre */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <img src={logo} alt="Logo OBC" className="h-8 w-auto" />
        <span className="font-heading text-lg font-bold text-primary">Olympic Basket</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {Object.entries(grouped).map(([section, items]) => {
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
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200',
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
        })}
      </nav>

      {/* Profil + déconnexion */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center gap-3 mb-3">
          <AdultAvatar userId={user!.id!} firstName={user!.firstName! || "firstname"} lastName={user.lastName! || "firstname"} sexe={user!.gender! as "M"|"F"}  />
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
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}