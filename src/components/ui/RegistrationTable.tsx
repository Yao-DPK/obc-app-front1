// src/components/admin/RegistrationTable.tsx
import { useState } from 'react';
import { useUserStore } from '@/stores/useUserStore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function RegistrationTable() {
  const { users, fetchUsers, updateUserStatus } = useUserStore();
  const [loading, setLoading] = useState(false);

  const pendingUsers = users.filter(
    (u) => u.registrationStatus === 'pre_inscrit' || u.registrationStatus === 'attestation_signee'
  );

  const handleValidate = async (userId: number) => {
    setLoading(true);
    try {
      await api.patch(`/api/users/${userId}/validate-registration`);
      toast.success('Inscription validée');
      await fetchUsers(); // rafraîchir la liste
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (userId: number) => {
    setLoading(true);
    try {
      await api.patch(`/api/users/${userId}/reject-registration`);
      toast.success('Inscription rejetée');
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (pendingUsers.length === 0) {
    return <p className="text-muted-foreground">Aucune inscription en attente.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nom</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Téléphone</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pendingUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.lastName} {user.firstName}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone || '-'}</TableCell>
            <TableCell>
              <Badge variant={user.registrationStatus === 'pre_inscrit' ? 'secondary' : 'outline'}>
                {user.registrationStatus === 'pre_inscrit' ? 'Pré-inscrit' : 'Attestation signée'}
              </Badge>
            </TableCell>
            <TableCell className="space-x-2">
              <Button size="sm" onClick={() => handleValidate(user.id)} disabled={loading}>
                Valider
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleReject(user.id)} disabled={loading}>
                Rejeter
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}