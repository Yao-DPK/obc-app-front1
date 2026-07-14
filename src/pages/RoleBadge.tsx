// src/components/ui/RoleBadge.tsx
import { Badge } from '@/components/ui/badge';
import {
  Crown,
  Shield,
  Users,
  User,
  ShieldCheck,
  UserCog,
  Heart,
  Baby,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ========== CONFIGURATION DES RÔLES ==========
// Ordre hiérarchique : Superviseur > Admin > Parent > Joueur
export const ROLE_CONFIG = {
  super_admin: {
    label: 'Superviseur',
    icon: Crown,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    hoverColor: 'hover:bg-amber-200',
  },
  admin: {
    label: 'Administrateur',
    icon: Shield,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    hoverColor: 'hover:bg-blue-200',
  },
  parent: {
    label: 'Parent',
    icon: Users,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    hoverColor: 'hover:bg-emerald-200',
  },
  player: {
    label: 'Joueur',
    icon: User,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    hoverColor: 'hover:bg-purple-200',
  },
} as const;

// ========== VARIANTES D'ICÔNES (alt) ==========
// Pour plus de variété, tu peux utiliser ces alternatives
export const ROLE_ICON_ALT = {
  super_admin: ShieldCheck,
  admin: UserCog,
  parent: Heart,
  player: Baby,
} as const;

// ========== COMPOSANT ==========
interface RoleBadgeProps {
  role: keyof typeof ROLE_CONFIG | string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  className?: string;
  useAltIcon?: boolean;
}

export function RoleBadge({
  role,
  showLabel = true,
  size = 'md',
  iconOnly = false,
  className,
  useAltIcon = false,
}: RoleBadgeProps) {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG];
  const Icon = useAltIcon
    ? ROLE_ICON_ALT[role as keyof typeof ROLE_ICON_ALT] || config?.icon || User
    : config?.icon || User;

  if (!config) {
    return (
      <Badge variant="outline" className={className}>
        <User className="h-3 w-3 mr-1" />
        {role || 'Utilisateur'}
      </Badge>
    );
  }

  const sizeClasses = {
    sm: { text: 'text-xs', icon: 'h-3 w-3', padding: 'px-2 py-0.5' },
    md: { text: 'text-sm', icon: 'h-3.5 w-3.5', padding: 'px-3 py-1' },
    lg: { text: 'text-base', icon: 'h-4 w-4', padding: 'px-4 py-1.5' },
  };

  const s = sizeClasses[size];

  if (iconOnly) {
    return (
      <div
        className={cn(
          'rounded-full p-1.5 inline-flex items-center justify-center',
          config.color,
          config.hoverColor,
          'transition-colors duration-200',
          className
        )}
        title={config.label}
      >
        <Icon className={s.icon} />
      </div>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'flex items-center gap-1.5 font-medium',
        config.color,
        config.hoverColor,
        s.padding,
        s.text,
        'transition-colors duration-200',
        className
      )}
    >
      <Icon className={s.icon} />
      {showLabel && config.label}
    </Badge>
  );
}

// ========== HOOK POUR RÉCUPÉRER LA CONFIG ==========
export function useRoleConfig(role: string) {
  const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG];
  return config || {
    label: role || 'Utilisateur',
    icon: User,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    hoverColor: 'hover:bg-gray-200',
  };
}