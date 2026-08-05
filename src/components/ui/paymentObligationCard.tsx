// components/payments/PaymentObligationCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentObligation } from '@/types/payment.type';

interface PaymentObligationCardProps {
  obligation: PaymentObligation;
  showPayButton?: boolean;
  onPay?: (obligation: PaymentObligation) => void;
  className?: string;
}

const STATUS_CONFIG: Record<
  PaymentObligation['status'],
  { label: string; variant: 'default' | 'destructive' | 'outline' | 'secondary' }
> = {
  pending: { label: 'En attente', variant: 'secondary' },
  partial: { label: 'Partiel', variant: 'outline' },
  paid: { label: 'Payé', variant: 'default' },
  overdue: { label: 'En retard', variant: 'destructive' },
  cancelled: { label: 'Annulé', variant: 'outline' },
};

export function PaymentObligationCard({
  obligation,
  showPayButton = false,
  onPay,
  className,
}: PaymentObligationCardProps) {
  const status = STATUS_CONFIG[obligation.status] || STATUS_CONFIG.pending;

  const isPayable = obligation.status !== 'paid' && obligation.status !== 'cancelled';
  const showAction = showPayButton && isPayable;

  return (
    <Card className={cn('w-full overflow-hidden transition-shadow hover:shadow-md', className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold">{obligation.description || 'Obligation de paiement'}</span>
          </div>
          <Badge variant={status.variant} className="whitespace-nowrap">
            {status.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-1 pb-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          {/* Montant total */}
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{obligation.totalAmount.toLocaleString()} FCFA</span>
              {obligation.paidAmount > 0 && (
                <span className="text-muted-foreground">
                  {' '}
                  (payé : {obligation.paidAmount.toLocaleString()} FCFA)
                </span>
              )}
            </span>
          </div>

          {/* Date d'échéance */}
          {obligation.dueDate && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Échéance :{' '}
                <span className="font-medium">
                  {new Date(obligation.dueDate).toLocaleDateString('fr-FR')}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Reste à payer (si non payé) */}
        {obligation.remainingAmount != null && obligation.remainingAmount > 0 && (
          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Reste : {obligation.remainingAmount.toLocaleString()} FCFA</span>
          </div>
        )}
      </CardContent>

      {showAction && (
        <CardFooter className="border-t bg-muted/30 pt-3">
          <Button
            onClick={() => onPay?.(obligation)}
            className="w-full sm:w-auto gap-2"
            size="sm"
          >
            <CreditCard className="h-4 w-4" />
            Payer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}