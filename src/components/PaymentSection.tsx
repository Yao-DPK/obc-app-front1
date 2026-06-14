// src/components/PaymentSection.tsx
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { usePaymentStore } from '@/stores/usePaymentStore';

interface PaymentSectionProps {
  playerId: number;
  onValidChange?: (isValid: boolean) => void;
  disabled?: boolean;
}

export function PaymentSection({ playerId, onValidChange }: PaymentSectionProps) {
  const { obligations, isLoadingObligations, fetchObligations } = usePaymentStore();
  const invalid_obligations = obligations.filter(o => o.status !== 'paid');
  const isSectionValid = invalid_obligations.length > 0;

  useEffect(() => {
    if (playerId) {
      fetchObligations(playerId);
    }
  }, [playerId, fetchObligations]);


  useEffect(() => {
    onValidChange?.(isSectionValid);
  }, [isSectionValid, onValidChange]);

  
  if (isLoadingObligations) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!obligations.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune obligation de paiement trouvée pour ce joueur.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {obligations.map((obligation) => (
        <Card key={obligation.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{obligation.description}</CardTitle>
              <Badge
                variant={
                  obligation.status === 'paid'
                    ? 'default'
                    : obligation.status === 'overdue'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {obligation.status === 'paid'
                  ? 'Payé'
                  : obligation.status === 'overdue'
                  ? 'En retard'
                  : 'En attente'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span>Montant : {obligation.amount.toLocaleString()} FCFA</span>
              <span>Date limite : {new Date(obligation.dueDate).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}