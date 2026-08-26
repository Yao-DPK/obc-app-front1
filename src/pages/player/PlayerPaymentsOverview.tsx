import { PaymentDialog } from "@/components/payment/PaymentDialog";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/PageHeader";
import { PaymentObligationCard } from "@/components/ui/paymentObligationCard";
import type { PaymentObligation, PaymentOperator } from "@/types";
import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

interface PlayerPaymentsOverviewProps{
    obligations: PaymentObligation[];
    userName: string;
    isLoading: boolean;
    isPaying: number | null;
    handlePay?: (obligation: PaymentObligation) => Promise<void>,
    handlePaymentSubmit?: ({ obligation, method, screenshot }: {
    obligation: PaymentObligation,   
    method: PaymentOperator;
    screenshot: File; }) => Promise<void>
}

export default function PlayerPaymentsOverview({obligations, userName, isLoading, isPaying, handlePay, handlePaymentSubmit}: PlayerPaymentsOverviewProps){
    
    const [paymentOpen, setPaymentOpen] = useState(false);
    
    const handleOpenDialog = () => {
      if(typeof handlePay !=undefined){
        console.log('Good')
      }
      setPaymentOpen(true);
    };

    if (isLoading && !obligations.length) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Chargement des paiements...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-20">
      <PageHeader title="Paiements" description={userName} showBack />

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
            (<>
            <PaymentObligationCard
              obligation={ob}
              showPayButton
              onSubmit={handleOpenDialog}
              isPaying={isPaying === ob.id}
              showEventName
            />

            <PaymentDialog
              open={paymentOpen}
              onOpenChange={setPaymentOpen}
              obligation={ob}
              onPaymentSubmit={handlePaymentSubmit!}
            />
            </>)
            
          ))}
        </div>
      )}
    </div>
  );

}