// src/components/payments/ObligationList.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { PaymentObligation } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_CONFIG = {
  pending: { label: 'En attente', icon: Clock, className: 'bg-amber-50 text-amber-700 border-amber-200' },
  partial: { label: 'Partiel', icon: AlertCircle, className: 'bg-blue-50 text-blue-700 border-blue-200' },
  paid: { label: 'Payé', icon: CheckCircle, className: 'bg-green-50 text-green-700 border-green-200' },
  overdue: { label: 'En retard', icon: AlertCircle, className: 'bg-red-50 text-red-700 border-red-200' },
  cancelled: { label: 'Annulé', icon: AlertCircle, className: 'bg-gray-50 text-gray-700 border-gray-200' },
};

interface ObligationListProps {
  obligations: PaymentObligation[];
  isLoading?: boolean;
  className?: string;
  showActions?: boolean;
  onViewIntents?: (obligationId: number) => void;
}

export function ObligationList({
  obligations,
  isLoading = false,
  className,
  showActions = false,
  onViewIntents,
}: ObligationListProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Obligations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (obligations.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Obligations</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune obligation de paiement trouvée.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          Obligations
          <Badge variant="secondary" className="ml-2">
            {obligations.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {obligations.map((ob) => {
          const status = STATUS_CONFIG[ob.status] || STATUS_CONFIG.pending;
          const StatusIcon = status.icon;

          return (
            <div
              key={ob.id}
              className="flex flex-wrap items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors gap-2"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{ob.description || 'Obligation'}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    {Number(ob.totalAmount).toLocaleString()} FCFA
                  </span>
                  {ob.paidAmount! > 0 && (
                    <span className="flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                      Payé: {Number(ob.paidAmount).toLocaleString()} FCFA
                    </span>
                  )}
                  {ob.dueDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(ob.dueDate).toLocaleDateString('fr-FR')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className={cn('flex items-center gap-1', status.className)}>
                  <StatusIcon className="h-3 w-3" />
                  {status.label}
                </Badge>

                {showActions && onViewIntents && (
                  <button
                    onClick={() => onViewIntents(ob.id!)}
                    className="text-sm text-primary hover:underline"
                  >
                    Voir paiements
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}