import { useEffect } from "react";
import { toast } from "sonner";
import { useKadev, type PaymentDetails } from "@/hooks/useKadev";
import type { PaymentObligation } from "@/types";
import { usePaymentStore } from "@/stores/usePaymentStore";
import { PaymentObligationCard } from "./ui/paymentObligationCard";
import { useAuth } from "@/stores/useAuth";

// Déclarer KadevPay globalement pour TypeScript
declare global {
  interface Window {
    KadevPay: any;
  }
}

export interface KadevResponse{
    reference:string,
    trans: string,
    status:string,
    message:string,
    transaction:string,
    trxref:string,
    redirecturl:string
}

export function PaymentComponent() {
  const {
    //paymentDetails,
    //setPaymentDetails, 
    //isLoading,
    //setIsLoading,
    scriptLoaded, 
    //setScriptLoaded, 
    handlePayment,
  } = useKadev();

  const { user } = useAuth();
  const { obligations, fetchObligations, updateObligation } = usePaymentStore();
  
  useEffect(() => {

      fetchObligations({playerIds: [89]});
      console.log(`Payments: ${JSON.stringify(obligations)}`)
    
  }, []);

  const handlePay = async (obligation: PaymentObligation) => {
      try {
        // Validation simple
        //console.log('1');
      if (!obligation.totalAmount || obligation.totalAmount <= 0) {
        toast.error('Montant invalide');
        return;
      }
      //console.log('2');
      if (!scriptLoaded) {
        toast.error('Le système de paiement n\'est pas encore prêt. Patientez...');
        return;
      }
      //console.log('3');
      const paymentDetails: PaymentDetails = {
          montant: obligation.totalAmount,
          email: "yao.konan2709@gmail.com",
          method: "momo",
      }
        //console.log('4');
      const response: any = await handlePayment(paymentDetails);
      console.log(`response: ${JSON.stringify(response)}`)

      if(response.status == 'success'){
        const obligationInfo: PaymentObligation = {
          eventId: obligation.eventId,
          playerId: obligation.userId,
          totalAmount: obligation.totalAmount,
          paidAmount: obligation.paidAmount,
          status: 'paid',
        }
        await updateObligation(obligation.id!, obligationInfo);

        
      }
        await fetchObligations();
      } catch (error) {
        console.log(`error: ${error}`);
        toast.error('Erreur lors de la mise à jour du statut');
      }
    };

/* Object Apres paiemnt Réussi: 
message: "Approved"
redirecturl: "?trxref=KDV-1785858810&reference=KDV-1785858810"
reference: "KDV-1785858810"
status: "success"
trans: 
"6424656812"
transaction: "6424656812"
trxref: "KDV-1785858810"

*/

  /* const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!paymentDetails.montant || paymentDetails.montant <= 0) {
      toast.error('Montant invalide');
      return;
    }
    if (!paymentDetails.email) {
      toast.error('Email requis');
      return;
    }
    if (!paymentDetails.method) {
      toast.error('Choisissez un moyen de paiement');
      return;
    }
    if (!scriptLoaded) {
      toast.error('Le système de paiement n\'est pas encore prêt. Patientez...');
      return;
    }

    setIsLoading(true);
    try {
      await handlePayment({
        montant: paymentDetails.montant,
        email: paymentDetails.email,
        name: paymentDetails.name,
        phone: paymentDetails.phone,
        method: paymentDetails.method,
        metadata: paymentDetails.metadata
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors du paiement';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des champs input classiques
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'montant') {
      setPaymentDetails(prev => ({ ...prev, montant: parseFloat(value) || 0 }));
    } else {
      setPaymentDetails(prev => ({ ...prev, [id]: value }));
    }
  };

  // Gestion du select
  const handleMethodChange = (value: string) => {
    setPaymentDetails(prev => ({ ...prev, method: value }));
  }; */

  /* return (
    <Card>
      <CardHeader>
        <CardTitle>Paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div>
            <Label htmlFor="montant">Montant (FCFA)</Label>
            <Input
              id="montant"
              type="number"
              placeholder="4500"
              value={paymentDetails.montant || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@gmail.com"
              value={paymentDetails.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Nom complet (optionnel)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Paul"
              value={paymentDetails.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone (optionnel)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0102030405"
              value={paymentDetails.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="method">Moyen de paiement</Label>
            <PaymentMethodSelector 
              value={paymentDetails.method} 
              onChange={handleMethodChange} 
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-secondary text-primary hover:bg-secondary/90"
            disabled={isLoading || !scriptLoaded}
          >
            {isLoading ? 'Paiement en cours...' : 'Payer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  ); */

  return(
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {obligations.map((ob) => (
          <PaymentObligationCard
            key={ob.id}
            obligation={ob}
            showPayButton
            onPay={handlePay}
          />
        ))}
    </div>
  );
}