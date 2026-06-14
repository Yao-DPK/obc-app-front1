// src/config/navigation.ts
import type { UserRole } from '@/types/user.type';
import { 
  LayoutDashboard, FileText, CreditCard, Users, UserCog, 
  Shield, Crown, UserPlus, BarChart3,
  type LucideIcon
} from 'lucide-react';


export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
  /** Section de regroupement (optionnel) */
  section?: 'principal' | 'gestion' | 'parametres' | 'admin';
  /** Affichage uniquement dans Sidebar (pas dans Header) */
  sidebarOnly?: boolean;
  /** Affichage uniquement dans Header (pas dans Sidebar) */
  headerOnly?: boolean;
}

const navItems: NavItem[] = [
  // Section principale – commun à tous
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['player', 'parent', 'admin', 'super_admin'], section: 'principal' },
  { to: '/documents', label: 'Documents', icon: FileText, roles: ['player', 'parent', 'admin', 'super_admin'], section: 'principal' },
  { to: '/payments', label: 'Paiements', icon: CreditCard, roles: ['player', 'parent', 'admin', 'super_admin'], section: 'principal' },
  { to: '/children', label: 'Mes enfants', icon: Users, roles: ['parent'], section: 'principal', sidebarOnly: true },
  
  // Section Gestion (pour admin et super admin)
  { to: '/admin/registrations', label: 'Valider inscriptions', icon: UserPlus, roles: ['admin'], section: 'gestion', sidebarOnly: true },
  { to: '/super-admin/registrations', label: 'Valider inscriptions', icon: UserPlus, roles: ['super_admin'], section: 'gestion', sidebarOnly: true },
  { to: '/admin/documents', label: 'Valider documents', icon: FileText, roles: ['admin', 'super_admin'], section: 'gestion', sidebarOnly: true },
  { to: '/admin/payments', label: 'Valider paiements', icon: CreditCard, roles: ['admin', 'super_admin'], section: 'gestion', sidebarOnly: true },
  
  // Section Administration (réservée super admin)
  { to: '/super-admin/admins', label: 'Gérer les admins', icon: UserCog, roles: ['super_admin'], section: 'admin', sidebarOnly: true },
  { to: '/super-admin/stats', label: 'Statistiques', icon: BarChart3, roles: ['super_admin'], section: 'admin', sidebarOnly: true },

  // Lien "Administration" pour la barre de navigation rapide (Header)
  { to: '/admin', label: 'Administration', icon: Shield, roles: ['admin', 'super_admin'], section: 'admin', headerOnly: true },
  { to: '/super-admin', label: 'Super Admin', icon: Crown, roles: ['super_admin'], section: 'admin', headerOnly: true },
];

// Optionnel : grouper par section pour la Sidebar
export const groupedNavItems = (role: UserRole) => {
  const filtered = navItems.filter(item => 
    item.roles.includes(role) && !item.headerOnly
  );
  
  return filtered.reduce((acc, item) => {
    const section = item.section || 'principal';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);
};

// Pour le Header (liens principaux, sans section admin si déjà dans un sous‑menu)
export const headerNavItems = (role: UserRole) => 
  navItems.filter(item => 
    item.roles.includes(role) && 
    !item.sidebarOnly &&
    item.section !== 'admin' // on gère les liens admin séparément dans le Header
  );

export default navItems;