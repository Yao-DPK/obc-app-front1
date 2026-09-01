// src/components/payments/IntentList.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentIntent } from '@/types';

const INTENT_STATUS_CONFIG = {
  pending: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200' },
  paid: { label: 'Validé', className: 'bg-green-50 text-green-700 border-green-200' },
  failed: { label: 'Rejeté', className: 'bg-red-50 text-red-700 border-red-200' },
  expired: { label: 'Expiré', className: 'bg-gray-50 text-gray-700 border-gray-200' },
  cancelled: { label: 'Annulé', className: 'bg-gray-50 text-gray-700 border-gray-200' },
};

interface IntentListProps {
  intents: PaymentIntent[];
  isLoading?: boolean;
  className?: string;
  showActions?: boolean;
  onVerify?: (intentId: number, status: 'paid' | 'failed') => Promise<void>;
  onViewJustification?: (url: string) => void;
  isVerifying?: boolean;
}

export function IntentList({
  intents,
  isLoading = false,
  className,
  showActions = false,
  onVerify,
  onViewJustification,
  isVerifying = false,
}: IntentListProps) {
  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Intentions de paiement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (intents.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Intentions de paiement</CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-muted-foreground">
          Aucune intention de paiement trouvée.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          Intentions de paiement
          <Badge variant="secondary" className="ml-2">
            {intents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {intents.map((intent) => {
          const status = INTENT_STATUS_CONFIG[intent.status] || INTENT_STATUS_CONFIG.pending;
          const metadata = intent.transactionMetadata as any;
          const isPending = intent.status === 'pending';

          return (
            <div
              key={intent.id}
              className="flex flex-wrap items-center justify-between p-4 border rounded-lg hover:bg-gray-50/50 transition-colors gap-2"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">
                    {Number(intent.amount).toLocaleString()} FCFA
                  </p>
                  <Badge variant="outline" className={cn('text-xs', status.className)}>
                    {status.label}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="capitalize">{intent.method}</span>
                  <span>•</span>
                  <span>{new Date(intent.createdAt!).toLocaleDateString('fr-FR')}</span>
                  {intent.verifiedAt && (
                    <>
                      <span>•</span>
                      <span>Vérifié le {new Date(intent.verifiedAt).toLocaleDateString('fr-FR')}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {metadata?.signedJustificationUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewJustification?.(metadata.signedJustificationUrl)}
                    className="gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    Justificatif
                  </Button>
                )}

                {showActions && isPending && onVerify && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white h-8 px-3 gap-1"
                      onClick={() => onVerify(intent.id!, 'paid')}
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="h-3.5 w-3.5" />
                      )}
                      Valider
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 px-3 gap-1"
                      onClick={() => onVerify(intent.id!, 'failed')}
                      disabled={isVerifying}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Rejeter
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}