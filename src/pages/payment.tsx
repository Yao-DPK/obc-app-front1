import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useKadev, type PaymentDetails } from "@/hooks/useKadev";
import type { PaymentObligation } from "@/types";
import { usePaymentStore } from "@/stores/usePaymentStore";
import { PaymentObligationCard } from "@/components/ui/paymentObligationCard";
import { Loader2, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";


export function PaymentComponent() {
  const params = useParams();
  const userId = Number(params.id);
  const { scriptLoaded, handlePayment } = useKadev();
  const { obligations, fetchObligations, updateObligation, isLoading } = usePaymentStore();
  const [isPaying, setIsPaying] = useState<number | null>(null); // ID de l'obligation en cours


  // Charger les obligations dès que userId change
  useEffect(() => {
    if (userId) {
      fetchObligations({ playerIds: [userId] });
    }
  }, [userId]);

  // Fonction pour traiter le paiement d'une obligation
  const handlePay = async (obligation: PaymentObligation) => {
    // Vérifications préalables
    if (!obligation.totalAmount || obligation.totalAmount <= 0) {
      toast.error("Montant invalide");
      return;
    }
    if (!scriptLoaded) {
      toast.error("Le système de paiement n'est pas encore prêt. Patientez...");
      return;
    }

    setIsPaying(obligation.id!);

    try {
      // 1. Préparer les détails de paiement
      const paymentDetails: PaymentDetails = {
        montant: obligation.totalAmount,
        email: "yao.konan2709@gmail.com", // À remplacer par l'email du parent connecté
        method: "momo",
        // Optionnel : nom, téléphone, métadonnées
        metadata: { obligationId: obligation.id! },
      };

      // 2. Appeler l'API de paiement (Kadev)
      const response: any = await handlePayment(paymentDetails);
      console.log("Réponse Kadev :", response);

      // 3. Vérifier le succès du paiement
      if (response?.status === "success") {
        // Marquer l'obligation comme payée (on pourrait aussi envoyer le montant payé)
        const updatedData: Partial<PaymentObligation> = {
          status: "paid",
          paidAmount: obligation.totalAmount,
        };

        // Mettre à jour l'obligation via le store
        await updateObligation(obligation.id!, updatedData);

        toast.success("Paiement effectué avec succès !");

        // Recharger la liste des obligations pour refléter le changement
        await fetchObligations({ playerIds: [userId] });
      } else {
        toast.error("Le paiement n'a pas abouti. Veuillez réessayer.");
      }
    } catch (error: any) {
      console.error("Erreur lors du paiement :", error);
      toast.error(error.response?.data?.message || "Erreur lors du paiement");
    } finally {
      setIsPaying(null);
    }
  };

  // Affichage pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Chargement de vos paiements...</span>
      </div>
    );
  }

  // Aucune obligation
  if (obligations.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Aucune obligation de paiement trouvée.</p>
          <p className="text-sm text-muted-foreground">
            Les paiements à effectuer apparaîtront ici.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Affichage de la liste des obligations
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {obligations.map((ob) => (
        <PaymentObligationCard
          key={ob.id}
          obligation={ob}
          showPayButton
          onPay={handlePay}
          isPaying={isPaying === ob.id}
        />
      ))}
    </div>
  );
}