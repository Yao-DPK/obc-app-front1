// src/config/navigation.ts
import type { UserRole } from '@/types/user.type';
import { 
  Baby,
  LayoutDashboard, User, UserPlus, File, 
  type LucideIcon, CreditCard, /* Calendar */
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
  section: 'principal' | 'gestion' | 'admin' | 'parametres';
}

const navItems: NavItem[] = [
  // Section principale – commun à tous
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['player', 'parent', 'admin', 'super_admin'], section: 'principal' },
  { to: '/profile', label: 'Profil', icon: User, roles: ['player', 'parent', 'admin', 'super_admin'], section: 'principal' },
  /* { to: '/documents', label: 'Documents', icon: FileText, roles: ['player', 'parent', 'admin', 'super_admin'], section: 'principal' },
  { to: '/payments', label: 'Paiements', icon: CreditCard, roles: ['player', 'parent', 'admin', 'super_admin'], section: 'principal' },
  { to: '/children', label: 'Mes enfants', icon: Users, roles: ['parent'], section: 'principal' } */,
  
  // Section Gestion (pour admin et super admin)
  { to: '/admin/registrations', label: 'Valider inscriptions', icon: UserPlus, roles: ['admin'], section: 'gestion' },
  { to: '/super-admin/registrations', label: 'Gestion inscriptions', icon: UserPlus, roles: ['super_admin'], section: 'gestion' },
  


  
  // Section Administration (réservée super admin)
  { to: '/super-admin/payment_events', label: 'Définition Paiements', icon: CreditCard, roles: ['super_admin'], section: 'admin' },
  { to: '/super-admin/document-types', label: 'Définition Documents', icon: File, roles: ['super_admin'], section: 'admin' }, 
  //{ to: '/super-admin/events', label: 'Définition Evènements', icon: Calendar, roles: ['super_admin'], section: 'admin' }, 
  //{ to: '/super-admin/stats', label: 'Statistiques', icon: BarChart3, roles: ['super_admin'], section: 'admin' },

  // Section Parent
  { to: 'parent/pupils', label: 'Enfants', icon: Baby, roles: ['parent'], section: 'gestion'}
  

].filter((item): item is NavItem => Boolean(item));

export const groupedNavItems = (role: UserRole) => {
  const filtered = navItems.filter(item => item.roles.includes(role));
  
  return filtered.reduce((acc, item) => {
    const section = item.section || 'principal';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);
};

export default navItems;