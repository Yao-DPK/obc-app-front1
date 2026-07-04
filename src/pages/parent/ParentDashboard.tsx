// apps/web/src/pages/dashboard/ParentDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useGuardianStore } from '@/stores/useGuardianStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, CreditCard, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

export default function ParentDashboard() {
  const { user } = useAuth();
  const { players, getMyPlayers, isLoading } = useGuardianStore();
  const { documents } = useDocumentStore();
  const { payments } = usePaymentStore();

  useEffect(() => {
    getMyPlayers();
    console.log(`user: ${JSON.stringify(user)}`);
  }, [user]);

  // Métriques
  const childrenCount = players.length;

  const missingDocs = players.filter((player) => {
    const playerDocs = documents.filter(d => d.userId === player.id);
    const hasMandatoryValid = playerDocs.some(d => d.isObligatory && d.validatedAt);
    return !hasMandatoryValid;
  }).length;

  const overduePayments = payments.filter(p => 
    p.status === 'pending' && new Date(p.declaredAt) < new Date()
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
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
            <div className="text-2xl font-bold">{childrenCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents manquants</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{missingDocs}</div>
            {missingDocs > 0 && (
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
          {players.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Aucun enfant enregistré. Contactez l'administration.
            </p>
          ) : (
            <div className="space-y-4">
              {players.map((player) => {
                const playerDocs = documents.filter(d => d.userId === player.id);
                const hasValidMedCert = playerDocs.some(d => 
                  d.type === 'Certificat Medical' && d.validatedAt
                );
                const hasPaymentUpToDate = payments.some(p => 
                  p.playerIds?.includes(player.id) && p.status === 'verified'
                );

                return (
                  <div key={player.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{player.firstName} {player.lastName}</p>
                      <p className="text-sm text-muted-foreground">
                        {player.school || ''} {player.class ? `- ${player.class}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {hasValidMedCert ? (
                        <CheckCircle className="h-5 w-5 text-green-500"  />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500"  />
                      )}
                      {hasPaymentUpToDate ? (
                        <CheckCircle className="h-5 w-5 text-green-500"  />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-orange-500"/>
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