// src/components/payments/PaymentDialog.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
type PaymentMethod = 'mtn' | 'orange' | 'wave';
type PaymentStatus = 'pending' | 'verified' | 'rejected';

interface PaymentData {
  method: PaymentMethod;
  phone: string;
  amount: number;
  reference?: string;
  screenshot?: File;
  status: PaymentStatus;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  obligationId: number;
  onPaymentSubmit: (data: { method: PaymentMethod; screenshot: File }) => Promise<void>;
}

const PAYMENT_INSTRUCTIONS: Record<PaymentMethod, { account: string; instructions: string }> = {
  mtn: {
    account: '01 23 45 67 89',
    instructions: 'Composez *126# → sélectionnez "Payer" → entrez le montant → confirmez.',
  },
  orange: {
    account: '07 89 65 43 21',
    instructions: 'Composez #144# → choisissez "Payer" → saisissez le montant → validez.',
  },
  wave: {
    account: '77 55 11 22 33',
    instructions: 'Ouvrez Wave → "Envoyer de l\'argent" → saisissez ce numéro → entrez le montant.',
  },
};

const STATUS_CONFIG: Record<PaymentStatus, { label: string; icon: React.ReactNode; className: string }> = {
  pending: {
    label: 'En attente de vérification',
    icon: <Clock className="h-4 w-4" />,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  verified: {
    label: 'Validé',
    icon: <CheckCircle className="h-4 w-4" />,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  rejected: {
    label: 'Rejeté',
    icon: <XCircle className="h-4 w-4" />,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
};

export function PaymentDialog({ open, onOpenChange, amount, obligationId, onPaymentSubmit }: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('mtn');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('pending');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (PNG, JPG, JPEG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La capture ne doit pas dépasser 5 Mo');
      return;
    }
    setScreenshot(file);
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      toast.error('Veuillez télécharger une capture d’écran du paiement');
      return;
    }
    setIsSubmitting(true);
    try {
      await onPaymentSubmit({ method: selectedMethod, screenshot });
      toast.success('Paiement soumis, en attente de vérification');
      setStatus('pending');
      setScreenshot(null);
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const instructions = PAYMENT_INSTRUCTIONS[selectedMethod];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Effectuer le paiement</DialogTitle>
          <DialogDescription>
            Choisissez votre moyen de paiement, suivez les instructions et téléchargez la capture.
          </DialogDescription>
        </DialogHeader>

        {/* Montant */}
        <div className="bg-primary/5 rounded-lg p-3 text-center">
          <p className="text-sm text-muted-foreground">Montant à payer</p>
          <p className="text-2xl font-bold text-primary">{amount.toLocaleString()} FCFA</p>
        </div>

        {/* Onglets */}
        <Tabs defaultValue="mtn" value={selectedMethod} onValueChange={(v) => setSelectedMethod(v as PaymentMethod)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="mtn">MTN</TabsTrigger>
            <TabsTrigger value="orange">Orange</TabsTrigger>
            <TabsTrigger value="wave">Wave</TabsTrigger>
          </TabsList>

          {(['mtn', 'orange', 'wave'] as PaymentMethod[]).map((method) => (
            <TabsContent key={method} value={method} className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="font-medium">Numéro de compte : <span className="text-primary">{PAYMENT_INSTRUCTIONS[method].account}</span></p>
                <p className="text-sm text-muted-foreground">{PAYMENT_INSTRUCTIONS[method].instructions}</p>
              </div>

              {/* Upload capture */}
              <div>
                <Label htmlFor="screenshot">Capture d’écran du paiement</Label>
                <div className="mt-1 flex items-center gap-3">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1"
                  />
                  {screenshot && (
                    <Badge variant="outline" className="text-xs">
                      {screenshot.name}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Formats : PNG, JPG, JPEG (max 5 Mo)</p>
              </div>

              {/* Statut (si déjà soumis) */}
              {status !== 'pending' && (
                <div className={cn('flex items-center gap-2 p-2 rounded-lg border', STATUS_CONFIG[status].className)}>
                  {STATUS_CONFIG[status].icon}
                  <span className="text-sm font-medium">{STATUS_CONFIG[status].label}</span>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Boutons */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !screenshot}
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Soumission...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Soumettre le paiement
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}