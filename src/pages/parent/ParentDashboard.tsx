// apps/web/src/pages/dashboard/ParentDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useGuardianStore } from '@/stores/useGuardianStore';
import { useUserStore } from '@/stores/useUserStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';

export default function ParentDashboard() {
  const { user } = useAuth();
  const { getPlayersByGuardian, fetchGuardianRelationships } = useGuardianStore();
  const { getUserById, fetchUsers } = useUserStore();
  const { documents, fetchDocuments } = useDocumentStore();
  const { payments, fetchPayments } = usePaymentStore();

  useEffect(() => {
    if (user?.id) {
      fetchGuardianRelationships();
      fetchUsers();
      // Récupérer les documents et paiements pour l'utilisateur courant (parent)
      fetchDocuments(user.id);
      fetchPayments(user.id);
    }
  }, [user]);

  const players = getPlayersByGuardian(user?.id || 0);
  const playersDetails = players.map(p => getUserById(p.playerId)).filter(Boolean);

  // Compter les documents manquants pour les enfants
  const childrenMissingDocs = playersDetails.filter(player => {
    const playerDocs = documents.filter(d => d.userId === player!.id);
    const hasMandatory = playerDocs.some(d => d.isObligatory && d.validatedAt);
    return !hasMandatory;
  }).length;

  // Vérifier les paiements en retard (ex: mensualité du mois)
  const overduePayments = payments.filter(p => p.status === 'pending' && new Date(p.declaredAt) < new Date()).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Tableau de bord"
        description="Suivez les activités de vos enfants"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enfants inscrits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{playersDetails.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents manquants</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{childrenMissingDocs}</div>
            {childrenMissingDocs > 0 && (
              <p className="text-xs text-orange-600">Documents obligatoires à fournir</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paiements en retard</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overduePayments}</div>
            {overduePayments > 0 && (
              <p className="text-xs text-red-600">Régularisez rapidement</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vos enfants</CardTitle>
        </CardHeader>
        <CardContent>
          {playersDetails.length === 0 ? (
            <p className="text-muted-foreground">Aucun enfant enregistré.</p>
          ) : (
            <div className="space-y-4">
              {playersDetails.map((player) => {
                const playerDocs = documents.filter(d => d.userId === player!.id);
                const hasValidMedCert = playerDocs.some(d => d.type === 'certificat_medical' && d.validatedAt);
                const hasPaymentUpToDate = payments.some(p => p.playerIds.includes(player!.id) && p.status === 'verified');
                return (
                  <div key={player!.id} className="flex items-center justify-between border-b pb-3">
                    <div>
                      <p className="font-medium">{player!.firstName} {player!.lastName}</p>
                      <p className="text-sm text-muted-foreground">{player!.school} - {player!.class}</p>
                    </div>
                    <div className="flex gap-3">
                      {hasValidMedCert ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {hasPaymentUpToDate ? (
                        <CheckCircle className="h-5 w-5 text-green-500"  />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-500"  />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}