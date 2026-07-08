// apps/web/src/pages/super_admin/ManageAdmins.tsx
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
//import { toast } from 'sonner';
import { useUserStore } from '@/stores/useUserStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, UserCog, Trash2 } from 'lucide-react';
import type { User } from '@/types/user.type';
import { useAuth } from '@/stores/useAuth';

// Schéma de validation pour le formulaire d'ajout
const adminSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
});

type AdminFormData = z.infer<typeof adminSchema>;

export default function ManageAdmins() {
  const { user } = useAuth();
   const { users, isLoading, fetchUsers } = useUserStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, /* setIsSubmitting */] = useState(false);

  const {
    register,
    handleSubmit,
    /* reset, */
    formState: { errors },
  } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
  });

  // Filtrer les administrateurs (rôle admin ou super_admin)
  const admins = users.filter((u) => u.role === 'admin' || u.role === 'super_admin');

  // Colonnes du tableau
  const columnHelper = createColumnHelper<User>();
  const columns = [
    columnHelper.accessor('email', { header: 'Email' }),
    columnHelper.accessor('firstName', { header: 'Prénom' }),
    columnHelper.accessor('lastName', { header: 'Nom' }),
    columnHelper.accessor('role', {
      header: 'Rôle',
      cell: (info) => (
        <Badge variant={info.getValue() === 'super_admin' ? 'default' : 'secondary'}>
          {info.getValue() === 'super_admin' ? 'Super Admin' : 'Admin'}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const admin = row.original;
        const isSelf = admin.id === user!.id; 
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(/* w */)}
            disabled={isSelf}
          >
            {isSelf ? 'Vous' : <Trash2 className="h-4 w-4" />}
          </Button>
        );
      },
    }),
  ];

  const table = useReactTable({
    data: admins,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Charger les utilisateurs au montage
  useEffect(() => {
    fetchUsers();
  }, []);

  // Ajouter un admin
  const onSubmit = async (/* data: AdminFormData */) => {
    /* setIsSubmitting(true);
    try {
      // Appel API pour créer un admin (à implémenter)
      // Exemple: await api.post('/api/admin/create', data);

      toast.success('Administrateur créé avec succès');
      setIsDialogOpen(false);
      reset();
      fetchUsers(); // Rafraîchir
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    } */
  };

  // Supprimer un admin
  const handleDelete = async (/* userId: number */) => {
    /* if (!confirm('Voulez-vous vraiment supprimer cet administrateur ?')) return;
    try {
      // Appel API pour supprimer un admin (à implémenter)
      // Exemple: await api.delete(`/api/admin/${userId}`);
      toast.success('Administrateur supprimé');
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    } */
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestion des administrateurs"
        description="Ajoutez ou supprimez des administrateurs du club"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-primary hover:bg-secondary/90">
              <UserCog className="mr-2 h-4 w-4" />
              Ajouter un admin
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvel administrateur</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" {...register('email')} placeholder="admin@club.com" />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" {...register('firstName')} placeholder="Jean" />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" {...register('lastName')} placeholder="Dupont" />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-primary text-white hover:bg-primary/90" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Créer l'admin
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Card>
        <CardContent className="p-0">
          {admins.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              Aucun administrateur trouvé.
            </div>
          ) : (
            <DataTable table={table} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}