import { useState } from 'react';
import { PageHeader } from './ui/PageHeader';
import { DataTable } from './ui/DataTable';
import { useReactTable, getCoreRowModel, createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Type Admin
interface Admin {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
}

// Données mockées
const mockAdmins: Admin[] = [
  { id: 1, email: 'admin1@club.com', firstName: 'Jean', lastName: 'Dupont', role: 'admin' },
  { id: 2, email: 'super@club.com', firstName: 'Marie', lastName: 'Curie', role: 'super_admin' },
];

const columnHelper = createColumnHelper<Admin>();

const columns = [
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('firstName', { header: 'Prénom' }),
  columnHelper.accessor('lastName', { header: 'Nom' }),
  columnHelper.accessor('role', { header: 'Rôle' }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (info) => (
      <Button variant="destructive" size="sm" onClick={() => toast.info('Fonction à implémenter')}>
        Supprimer
      </Button>
    ),
  }),
];

export default function ManageAdmins() {
  const [data] = useState(mockAdmins);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Gestion des administrateurs" description="Ajoutez ou supprimez des admins">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-primary">+ Nouvel admin</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un administrateur</DialogTitle>
            </DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success('Admin ajouté (mock)'); }}>
              <div><Label>Email</Label><Input required /></div>
              <div><Label>Prénom</Label><Input required /></div>
              <div><Label>Nom</Label><Input required /></div>
              <Button type="submit">Créer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      <DataTable table={table} />
    </div>
  );
}