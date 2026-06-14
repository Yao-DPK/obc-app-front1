// src/components/admin/RegistrationTable.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useUserStore } from '@/stores/useUserStore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Users, Loader2 } from 'lucide-react';
import api from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

export function RegistrationTable() {
  const { users, fetchUsers } = useUserStore();
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const pendingUsers = users.filter(
    (u) => u.registrationStatus === 'pre_inscrit' || u.registrationStatus === 'attestation_signee'
  );

  const handleValidate = async (userId: number) => {
    setLoadingId(userId);
    try {
      const selectedUser = users.find((u) => u.id === userId);
      if (!selectedUser) {
        toast.error("Cet utilisateur n'existe pas");
        return;
      }
      navigate(`validate/${userId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (userId: number) => {
    setLoadingId(userId);
    try {
      await api.patch(`/api/users/${userId}/reject-registration`);
      toast.success('Inscription rejetée');
      await fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoadingId(null);
    }
  };

  if (pendingUsers.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune inscription en attente.</p>
          <p className="text-sm text-muted-foreground">Les nouvelles inscriptions apparaîtront ici.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-heading text-primary">
            Inscriptions en attente ({pendingUsers.length})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Validez ou rejetez les demandes d'inscription.
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {/* Version desktop */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Nom complet</TableHead>
                  <TableHead className="text-left">Email</TableHead>
                  <TableHead className="text-left">Téléphone</TableHead>
                  <TableHead className="text-left">Statut</TableHead>
                  <TableHead className="text-left">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.lastName} {user.firstName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '—'}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.registrationStatus === 'pre_inscrit'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }
                      >
                        {user.registrationStatus === 'pre_inscrit' ? '📋 Pré-inscrit' : '✍️ Attestation signée'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleValidate(user.id)}
                        disabled={loadingId === user.id}
                      >
                        {loadingId === user.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(user.id)}
                        disabled={loadingId === user.id}
                      >
                        {loadingId === user.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Rejeter
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Version mobile (cartes) */}
          <div className="md:hidden divide-y">
            {pendingUsers.map((user) => (
              <div key={user.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-semibold text-primary">
                      {user.lastName} {user.firstName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm">{user.phone || '—'}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      user.registrationStatus === 'pre_inscrit'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-blue-50 text-blue-700 border-blue-200'
                    }
                  >
                    {user.registrationStatus === 'pre_inscrit' ? 'Pré-inscrit' : 'Attestation signée'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleValidate(user.id)}
                    disabled={loadingId === user.id}
                  >
                    {loadingId === user.id ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-1" />
                    )}
                    Valider
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(user.id)}
                    disabled={loadingId === user.id}
                  >
                    {loadingId === user.id ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-1" />
                    )}
                    Rejeter
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}