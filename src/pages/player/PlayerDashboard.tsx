/* // apps/web/src/pages/dashboard/PlayerDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useUserStore } from '@/stores/useUserStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, CreditCard, User, CheckCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';

export default function PlayerDashboard() {
  const { user } = useAuth();
  const { getUserById, fetchUsers } = useUserStore();
  const { documents, fetchDocuments } = useDocumentStore();
  const { payments, fetchPayments } = usePaymentStore();

  useEffect(() => {
    if (user?.id) {
      fetchUsers(); // pour pouvoir obtenir les détails de l'utilisateur
      fetchDocuments(user.id);
      fetchPayments(user.id);
    }
  }, [user]);

  const playerDetails = user ? getUserById(user.id) : null;
  const pendingDocs = documents.filter(d => !d.validatedAt).length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const upcomingTraining = "Mercredi 10 mai à 18h"; // À remplacer par API

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <PageHeader
        title="Mon espace"
        description="Bienvenue sur votre tableau de bord personnel"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Prochain entraînement</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTraining}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pendingDocs === 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Tous les documents sont validés</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600">
                <AlertCircle className="h-5 w-5" />
                <span>{pendingDocs} document(s) en attente de validation</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Paiements</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {pendingPayments === 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Aucun impayé</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{pendingPayments} paiement(s) en attente</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{playerDetails?.lastName} {playerDetails?.firstName}</p>
              <p className="text-sm text-muted-foreground">{playerDetails?.email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Date de naissance :</span>
              <span className="ml-2">{playerDetails?.birthDate || 'Non renseignée'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Téléphone :</span>
              <span className="ml-2">{playerDetails?.phone || 'Non renseigné'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Établissement :</span>
              <span className="ml-2">{playerDetails?.school || 'Non renseigné'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Classe :</span>
              <span className="ml-2">{playerDetails?.class || 'Non renseignée'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} */