import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';

import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { PaymentObligationCard } from '@/components/ui/paymentObligationCard';
import { useKadev, type PaymentDetails } from '@/hooks/useKadev';
import { useGuardianStore } from '@/stores/useGuardianStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import type { PaymentObligation } from '@/types';

// ============================================================
// 1. INITIALISATION
// ============================================================

export default function ChildPaymentsPage() {
  const { id } = useParams<{ id: string }>();
  const playerId = Number(id);

  // Données préchargées par le loader
  const initialObligations = useLoaderData<PaymentObligation[]>();

  // Stores
  const { obligations, setObligations, updateObligation, fetchObligations, isLoading: storeLoading } =
    usePaymentStore();
  const { players } = useGuardianStore();

  // État local
  const [isPaying, setIsPaying] = useState<number | null>(null);
  const { scriptLoaded, handlePayment } = useKadev();

  // Trouver l'enfant concerné
  const user = players.find((u) => u.id === playerId);
  const childName = user ? `${user.firstName} ${user.lastName}` : 'Enfant';

  // Charger les obligations dans le store dès que les données du loader sont disponibles
  useEffect(() => {
    if (initialObligations && initialObligations.length) {
      setObligations(initialObligations);
    }
  }, [initialObligations, setObligations]);

  // Si le store n'a pas d'obligations, on recharge (cas du rechargement de page)
  useEffect(() => {
    if (playerId && !obligations.length) {
      fetchObligations({ playerIds: [playerId] });
    }
  }, [playerId]);

  // ============================================================
  // 2. LOGIQUE MÉTIER (handlers)
  // ============================================================

  const handlePay = async (obligation: PaymentObligation) => {
    if (!obligation.totalAmount || obligation.totalAmount <= 0) {
      toast.error('Montant invalide');
      return;
    }
    if (!scriptLoaded) {
      toast.error('Le système de paiement n\'est pas encore prêt. Patientez...');
      return;
    }

    setIsPaying(obligation.id!);

    try {
      const paymentDetails: PaymentDetails = {
        montant: obligation.totalAmount,
        email: 'yao.konan2709@gmail.com', // À remplacer par l'email du parent connecté
        method: 'momo',
        metadata: { obligationId: obligation.id! },
      };

      const response: any = await handlePayment(paymentDetails);

      if (response?.status === 'success') {
        const updatedData: Partial<PaymentObligation> = {
          status: 'paid',
          paidAmount: obligation.totalAmount,
        };

        await updateObligation(obligation.id!, updatedData);
        toast.success('Paiement effectué avec succès !');
        await fetchObligations({ playerIds: [playerId] });
      } else {
        toast.error('Le paiement n\'a pas abouti. Veuillez réessayer.');
      }
    } catch (error: any) {
      console.error('Erreur lors du paiement :', error);
      toast.error(error.response?.data?.message || 'Erreur lors du paiement');
    } finally {
      setIsPaying(null);
    }
  };

  // ============================================================
  // 3. RENDU (UI)
  // ============================================================

  if (storeLoading && !obligations.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Chargement des paiements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      <PageHeader title="Paiements" description={childName} showBack />

      {obligations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucune obligation de paiement trouvée.</p>
            <p className="text-sm text-muted-foreground">
              Les paiements à effectuer apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {obligations.map((ob) => (
            <PaymentObligationCard
              obligation={ob}
              showPayButton
              onPay={handlePay}
              isPaying={isPaying === ob.id}
              showEventName
            />
          ))}
        </div>
      )}
    </div>
  );
}