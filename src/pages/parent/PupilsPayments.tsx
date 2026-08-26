import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useKadev, type PaymentDetails } from '@/hooks/useKadev';
import { useGuardianStore } from '@/stores/useGuardianStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import type { PaymentObligation, PaymentOperator } from '@/types';
import { paymentIntentService } from '@/lib/services/paymentIntent.service';
import PlayerPaymentsOverview from '../player/PlayerPaymentsOverview';

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

  const handlePaymentSubmit = async ({ obligation, method, screenshot }: { obligation: PaymentObligation, method: PaymentOperator; screenshot: File }) => {
      const formData = new FormData();
      formData.append('obligationId', String(obligation!.id));
      formData.append('amount', String(obligation!.totalAmount));
      formData.append('userId', String(user!.id));
      formData.append('method', method);
      formData.append('screenshot', screenshot);
      try {
        await paymentIntentService.create(formData);
        toast.success(`Paiement envoyé pour vérification`);
      } catch (error: any) {
        console.log(`Erreur de paiement: ${error.message}`)
        toast.error(`Erreur lors de l'envoi du paiement`);
      }
      
    };

    // ============================================================
    // 3. RENDU (UI)
    // ============================================================

    return <PlayerPaymentsOverview 
        obligations={obligations}
        userName={childName}
        isLoading={storeLoading}
        isPaying={isPaying}
        handlePay={handlePay}
        handlePaymentSubmit={handlePaymentSubmit}
    
      />
}