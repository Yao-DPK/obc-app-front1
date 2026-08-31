// src/pages/admin/AdminUsers.tsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, X, Users as UsersIcon, Loader2 } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { UserCard } from './UserCard';
import { cn } from '@/lib/utils';

export default function AdminUsers() {
  const { users, fetchUsers, isLoading } = useUserStore();

  // États des filtres
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('all');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Charger les utilisateurs
  useEffect(() => {
    const filters: any = {};
    if (debouncedSearch) filters.search = debouncedSearch;
    if (role && role !== 'all') filters.role = role;
    fetchUsers(filters);
  }, [debouncedSearch, role]);

  const clearFilters = () => {
    setSearch('');
    setRole('all');
  };

  const hasActiveFilters = search || (role && role !== 'all');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-20"
    >
      <PageHeader
        title="Gestion des utilisateurs"
        description="Consultez et gérez tous les utilisateurs de la plateforme"
      />

      {/* ====== FILTRES ====== */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par nom, prénom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-[150px] sm:w-[180px]">
                <SelectValue placeholder="Tous les rôles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="player">Joueurs</SelectItem>
                <SelectItem value="parent">Parents</SelectItem>
                <SelectItem value="admin">Administrateurs</SelectItem>
                <SelectItem value="super_admin">Super Admins</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="icon" onClick={clearFilters} title="Effacer les filtres">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ====== STATISTIQUES ====== */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {isLoading ? 'Chargement...' : `${users.length} utilisateur${users.length > 1 ? 's' : ''}`}
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchUsers()}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UsersIcon className="h-4 w-4" />
          )}
          Actualiser
        </Button>
      </div>

      {/* ====== GRILLE DES CARTES ====== */}
      {isLoading && !users.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <div className="flex gap-1 pt-1">
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters
                ? 'Aucun utilisateur ne correspond à vos critères de recherche.'
                : 'Aucun utilisateur n\'est encore enregistré.'}
            </p>
            {hasActiveFilters && (
              <Button variant="outline" className="mt-4" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </motion.div>
  );
}