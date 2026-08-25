import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaymentSection } from './PaymentSection';

interface PaymentTabProps {
  playerId: number;
  onValidChange: (isValid: boolean) => void;
}

export function PaymentTab({ playerId, onValidChange }: PaymentTabProps) {
  const handleValidChange = (isValid: boolean) => {
    onValidChange(isValid);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Paiement</span>
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                Étape 3/3
              </Badge>
            </CardTitle>
            <CardDescription>
              Vérifiez les paiements de l'utilisateur.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PaymentSection playerId={playerId} onValidChange={handleValidChange} />
      </CardContent>
    </Card>
  );
}