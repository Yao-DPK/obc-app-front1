// src/pages/admin/UserPaymentHistory.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { RefreshCw, User } from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { usePaymentIntentStore } from '@/stores/usePaymentIntentStore';
import { useUserStore } from '@/stores/useUserStore';
import { PaymentStats } from '@/components/payment/PaymentStats';
import { ObligationList } from '@/components/payment/ObligationList';
import { IntentList } from '@/components/payment/IntentList';
import { JustificationViewer } from '@/components/payment/JustificationViewer';
import { Badge } from '@/components/ui/badge';

export default function UserPaymentHistory() {
  const { userId } = useParams<{ userId: string }>();
  const userIdNum = Number(userId);

  // Stores
  const { user, fetchUserById, isLoading: userLoading } = useUserStore();
  const {
    obligations,
    fetchObligations,
    isLoadingObligations,
  } = usePaymentStore();
  const {
    intents,
    isLoading: intentsLoading,
    fetchIntents,
    verifyIntent,
  } = usePaymentIntentStore();

  // États locaux
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerUrl, setViewerUrl] = useState('');
  const [selectedObligationId, setSelectedObligationId] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeTab, setActiveTab] = useState('obligations');

  // Charger l'utilisateur
  useEffect(() => {
    if (userIdNum) {
      fetchUserById(userIdNum);
      console.log(`user: ${JSON.stringify(user)}`);
    }
  }, [userIdNum]);

  // Charger les obligations
  useEffect(() => {
    if (userIdNum) {
      fetchObligations({ playerIds: [userIdNum] });
      console.log(`received obligations: ${JSON.stringify(obligations)}`);

    }
  }, [userIdNum]);

  // Charger les intentions en attente (pour les stats)
  useEffect(() => {
    fetchIntents({userId: userIdNum});
    console.log(`base intents: ${JSON.stringify(intents)}`);
  }, []);

  // Filtrer les obligations du joueur
  const playerObligations = obligations.filter(o => o.playerId === userIdNum);
  const playerIntents = intents.filter(i => i.userId === userIdNum);

  // Calculs pour les statistiques
  const totalObligations = playerObligations.length;
  const totalIntents = playerIntents.length;
  const totalAmount = playerObligations.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const totalPaid = playerObligations.reduce((sum, o) => sum + Number(o.paidAmount || 0), 0);
  const totalRemaining = totalAmount - totalPaid;
  const pendingIntents = intents.filter(i => i.status === 'pending' && i.userId === userIdNum).length;
  const pendingObligations = obligations.filter(o => o.status === 'pending' && o.playerId === userIdNum).length;

  // Voir les intentions d'une obligation
  const handleViewIntents = async (obligationId: number) => {
    setSelectedObligationId(obligationId);
    await fetchIntents({obligationId: obligationId});
    setActiveTab('intents');
  };

  // Vérifier une intention
  const handleVerify = async (intentId: number, status: 'paid' | 'failed') => {
    setIsVerifying(true);
    try {
      await verifyIntent(intentId, status);
      toast.success(status === 'paid' ? 'Paiement validé' : 'Paiement rejeté');
      // Recharger les données
      if (selectedObligationId) {
        await fetchIntents({obligationId: selectedObligationId});
      }
      await fetchObligations({ playerIds: [userIdNum] });
      await fetchIntents({status: 'pending'});
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsVerifying(false);
    }
  };

  // Ouvrir le justificatif
  const handleViewJustification = (url: string) => {
    setViewerUrl(url);
    setViewerOpen(true);
  };

  const isLoading = userLoading || isLoadingObligations || intentsLoading;

  if (isLoading && !user) {
    return (
      <div className="space-y-6">
        <PageHeader title="Chargement..." description="Paiements de l'utilisateur" showBack />
        <div className="grid grid-cols-1 gap-6">
          <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />
          <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader title="Utilisateur non trouvé" showBack />
        <div className="p-8 text-center text-muted-foreground">
          L'utilisateur avec l'ID {userIdNum} n'existe pas.
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 mb-20"
    >
      {/* ====== EN-TÊTE ====== */}
      <PageHeader
        title={`Paiements de ${user.firstName} ${user.lastName}`}
        description={`${user.email}`}
        showBack
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchObligations({ playerIds: [userIdNum] });
              fetchIntents({status: 'pending'});
            }}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Link to={`/admin/users/${userIdNum}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </Button>
          </Link>
        </div>
      </PageHeader>

      {/* ====== STATISTIQUES ====== */}
      <PaymentStats
        totalObligations={totalObligations}
        totalIntents={totalIntents}
        totalAmount={totalAmount}
        totalPaid={totalPaid}
        totalRemaining={totalRemaining}
        pendingIntents={pendingIntents}
        pendingObligations={pendingObligations}
        isLoading={isLoading}
      />

      {/* ====== ONGLETS ====== */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1 rounded-xl">
          <TabsTrigger
            value="obligations"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-lg transition-all duration-300 flex items-center gap-2 py-2.5"
          >
            Obligations
            <Badge variant="secondary" className="ml-1 text-xs">
              {totalObligations}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="intents"
            className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary rounded-lg transition-all duration-300 flex items-center gap-2 py-2.5"
          >
            Intentions
            {selectedObligationId && (
              <Badge variant="secondary" className="ml-1 text-xs">
                Filtré
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ====== OBLIGATIONS ====== */}
        <TabsContent value="obligations" className="mt-6">
          <ObligationList
            obligations={playerObligations}
            isLoading={isLoading}
            showActions
            onViewIntents={handleViewIntents}
          />
        </TabsContent>

        {/* ====== INTENTIONS ====== */}
        <TabsContent value="intents" className="mt-6">
          <IntentList
            intents={intents.filter(i => i.userId === userIdNum)}
            isLoading={isLoading}
            showActions
            onVerify={handleVerify}
            onViewJustification={handleViewJustification}
            isVerifying={isVerifying}
          />
        </TabsContent>
      </Tabs>

      {/* ====== VIEWER ====== */}
      <JustificationViewer
        open={viewerOpen}
        onOpenChange={setViewerOpen}
        url={viewerUrl}
      />
    </motion.div>
  );
}