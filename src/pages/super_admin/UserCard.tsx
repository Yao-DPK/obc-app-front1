// src/components/admin/UserCard.tsx
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AdultAvatar } from '@/components/CustomAdultAvatar';
import {
  FileText,
  CreditCard,
  Info,
  UserCheck,
  UserCog,
  Users,
} from 'lucide-react';
import type { User } from '@/types';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/types/role.type';

interface UserCardProps {
  user: User;
  className?: string;
}

export function UserCard({ user, className }: UserCardProps) {
  const isPlayer = user.role === 'player';
  const isParent = user.role === 'parent';
  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

  const getStatusColor = () => {
    if (user.registrationStatus === 'inscrit') return 'bg-green-100 text-green-700 border-green-200';
    if (user.registrationStatus === 'rejeté') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-amber-100 text-amber-700 border-amber-200';
  };

  return (
    <Card className={cn('overflow-hidden transition-all duration-200 hover:shadow-md', className)}>
      <CardContent className="p-4 space-y-3">
        {/* ====== AVATAR + NOM ====== */}
        <div className="flex items-center gap-3">
          <AdultAvatar
            userId={user.id}
            firstName={user.firstName || ''}
            lastName={user.lastName || ''}
            sexe={user.gender as 'M' | 'F' || 'M'}
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-primary truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>

        {/* ====== RÔLE + STATUT ====== */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {ROLE_LABELS[user.role] || user.role}
          </Badge>
          <Badge variant="outline" className={getStatusColor()}>
            {user.registrationStatus === 'inscrit'
              ? '✅ Inscrit'
              : user.registrationStatus === 'rejeté'
              ? '❌ Rejeté'
              : '📋 Pré-inscrit'}
          </Badge>
        </div>

        {/* ====== ACTIONS ====== */}
        <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
          <TooltipProvider>
            {/* Tous les rôles : Infos */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-blue-600 hover:bg-blue-50"
                  asChild
                >
                  <Link to={`/super-admin/users/${user.id}`}>
                    <Info className="h-4 w-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Informations</TooltipContent>
            </Tooltip>

            {/* Joueur : Documents */}
            {isPlayer && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-amber-600 hover:bg-amber-50"
                    asChild
                  >
                    <Link to={`/admin/users/${user.id}/documents`}>
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Documents</TooltipContent>
              </Tooltip>
            )}

            {/* Joueur : Paiements */}
            {isPlayer && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                    asChild
                  >
                    <Link to={`/super-admin/users/${user.id}/payments`}>
                      <CreditCard className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Paiements</TooltipContent>
              </Tooltip>
            )}

            {/* Joueur : Validation d'inscription */}
            {isPlayer && user.registrationStatus !== 'inscrit' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                    asChild
                  >
                    <Link to={`/super-admin/registrations/validate/${user.id}`}>
                      <UserCheck className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Valider l'inscription</TooltipContent>
              </Tooltip>
            )}

            {/* Admin : Gestion des rôles (réservé super_admin) */}
            {/* {user.role !== 'super_admin' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-purple-600 hover:bg-purple-50"
                    asChild
                  >
                    <Link to={`/admin/users/${user.id}/role`}>
                      <UserCog className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Gérer le rôle</TooltipContent>
              </Tooltip>
            )} */}
          </TooltipProvider>

          <div className="flex-1" />

          {/* Date d'adhésion (optionnelle) */}
          {user.createdAt && (
            <span className="text-xs text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}