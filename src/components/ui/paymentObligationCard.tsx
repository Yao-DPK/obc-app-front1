import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentObligation } from '@/types/payment.type';

// ========== CONFIGURATION DES STATUTS ==========
const STATUS_CONFIG = {
  pending: {
    label: 'En attente',
    icon: Clock,
    variant: 'secondary' as const,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  partial: {
    label: 'Partiel',
    icon: AlertCircle,
    variant: 'outline' as const,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  paid: {
    label: 'Payé',
    icon: CheckCircle2,
    variant: 'default' as const,
    color: 'text-green-600 bg-green-50 border-green-200',
  },
  overdue: {
    label: 'En retard',
    icon: AlertCircle,
    variant: 'destructive' as const,
    color: 'text-red-600 bg-red-50 border-red-200',
  },
  cancelled: {
    label: 'Annulé',
    icon: XCircle,
    variant: 'outline' as const,
    color: 'text-gray-500 bg-gray-100 border-gray-200',
  },
};

// ========== PROPS ==========
interface PaymentObligationCardProps {
  obligation: PaymentObligation;
  showPayButton?: boolean;
  onPay?: (obligation: PaymentObligation) => void;
  className?: string;
  isPaying?: boolean;
  showEventName?: boolean;
}

export function PaymentObligationCard({
  obligation,
  showPayButton = false,
  onPay,
  className,
  isPaying = false,
  showEventName = true,
}: PaymentObligationCardProps) {
  const statusConfig = STATUS_CONFIG[obligation.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;

  // Sécurisation des montants
  const totalAmount = obligation.totalAmount ?? 0;
  const paidAmount = obligation.paidAmount ?? 0;
  const remainingAmount = obligation.remainingAmount ?? totalAmount - paidAmount;

  const isPayable = obligation.status !== 'paid' && obligation.status !== 'cancelled';
  const showAction = showPayButton && isPayable;
  const isOverdue = obligation.status === 'overdue';

  return (
    <Card 
      className={cn(
        'w-full overflow-hidden transition-all duration-200 hover:shadow-md',
        isOverdue && 'border-red-300',
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn(
              'p-1.5 rounded-lg flex-shrink-0',
              statusConfig.color.replace(/text-\w+-\d+/g, '').trim() || 'bg-gray-100'
            )}>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <span className="font-semibold truncate block">
                {obligation.description || 'Obligation de paiement'}
              </span>
              {showEventName && obligation.name && (
                <span className="text-xs text-muted-foreground block truncate">
                  {obligation.name}
                </span>
              )}
            </div>
          </div>

          <Badge 
            variant={statusConfig.variant} 
            className={cn(
              'flex items-center gap-1.5 whitespace-nowrap flex-shrink-0',
              statusConfig.color
            )}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-3">
        {/* Montants */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
          <div className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>
              <span className="font-medium">{totalAmount.toLocaleString()} FCFA</span>
              {paidAmount > 0 && (
                <span className="text-muted-foreground ml-1">
                  (payé : {paidAmount.toLocaleString()} FCFA)
                </span>
              )}
            </span>
          </div>

          {obligation.dueDate && (
            <div className={cn(
              'flex items-center gap-1.5',
              isOverdue && 'text-red-600 font-medium'
            )}>
              <Calendar className="h-4 w-4" />
              <span>
                Échéance : {new Date(obligation.dueDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}
        </div>

        {/* Reste à payer */}
        {remainingAmount > 0 && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Reste à payer : <strong>{remainingAmount.toLocaleString()} FCFA</strong></span>
          </div>
        )}

        {/* Indicateur si déjà payé */}
        {obligation.status === 'paid' && obligation.updatedAt && (
          <div className="flex items-center gap-1.5 text-xs text-green-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
        )}
      </CardContent>

      {showAction && (
        <CardFooter className="border-t bg-muted/30 pt-3">
          <Button
            onClick={() => onPay?.(obligation)}
            className="w-full sm:w-auto gap-2"
            size="sm"
            disabled={isPaying}
          >
            {isPaying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Paiement en cours...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Payer {remainingAmount > 0 && `(${remainingAmount.toLocaleString()} FCFA)`}
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}