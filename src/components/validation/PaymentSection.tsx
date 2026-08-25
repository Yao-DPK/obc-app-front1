import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { toast } from 'sonner';

interface PaymentSectionProps {
  playerId: number;
  onValidChange?: (isValid: boolean) => void;
  disabled?: boolean;
}

export function PaymentSection({ playerId, onValidChange }: PaymentSectionProps) {
  const { obligations, isLoadingObligations, fetchObligations, updateObligation } = usePaymentStore();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const invalid_obligations = obligations.filter(o => o.status !== 'paid');
  const isSectionValid = invalid_obligations.length === 0; // valid si aucune non payée 

  useEffect(() => {
    onValidChange?.(isSectionValid);
  }, [isSectionValid, onValidChange]);

  const handleStatusChange = async (obligationId: number, newStatus: string) => {
    setUpdatingId(obligationId);
    try {
      await updateObligation(obligationId, {status: newStatus as "pending" | "partial" | "paid" | "overdue" | "cancelled"});

      toast.success(`Statut mis à jour : ${newStatus}`);
      await fetchObligations({playerIds: [playerId]});
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingId(null);
    }
  };

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
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    obligation.status === 'paid'
                      ? 'default'
                      : obligation.status === 'overdue'
                      ? 'secondary'
                      : 'secondary'
                  }
                >
                  {obligation.status === 'paid'
                    ? 'Payé'
                    : obligation.status === 'overdue'
                    ? 'En retard'
                    : obligation.status === 'cancelled'
                    ? 'Annulé'
                    : 'En attente'}
                </Badge>
                <Select
                  value={obligation.status}
                  onValueChange={(val) => handleStatusChange(obligation.id!, val)}
                  disabled={updatingId === obligation.id}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="paid">Payé</SelectItem>
                    <SelectItem value="overdue">En retard</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span>Montant : {obligation.totalAmount!.toLocaleString()} FCFA</span>
              <span>Date limite : {obligation.dueDate ? new Date(obligation.dueDate).toLocaleDateString() : 'Non définie'}</span>
            </div>
          </CardContent>
        </Card>
      ))}

      
    </div>
  );
}