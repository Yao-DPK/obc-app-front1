// src/components/payments/PaymentDialog.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Phone, 
  Wallet, 
  Image,
  X,
  Shield,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentObligation, PaymentOperator, PaymentStatus } from '@/types';

// ========== CONFIGURATION ==========

const PAYMENT_INSTRUCTIONS: Record<PaymentOperator, { 
  account: string; 
  instructions: string[];
  color: string;
  icon: React.ReactNode;
}> = {
  mtn: {
    account: '01 23 45 67 89',
    instructions: [
      'Composez *126# sur votre téléphone MTN',
      'Sélectionnez "Payer" dans le menu',
      'Entrez le montant exact',
      'Confirmez la transaction'
    ],
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: <Phone className="h-5 w-5" />,
  },
  orange: {
    account: '07 89 65 43 21',
    instructions: [
      'Composez #144# sur votre téléphone Orange',
      'Choisissez l\'option "Payer"',
      'Saisissez le montant à payer',
      'Validez la transaction'
    ],
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: <Phone className="h-5 w-5" />,
  },
  wave: {
    account: '77 55 11 22 33',
    instructions: [
      'Ouvrez l\'application Wave',
      'Sélectionnez "Envoyer de l\'argent"',
      'Saisissez le numéro de compte ci-dessous',
      'Entrez le montant et confirmez'
    ],
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: <Wallet className="h-5 w-5" />,
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

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  obligation: PaymentObligation;
  onPaymentSubmit: (data: { obligation: PaymentObligation, method: PaymentOperator; screenshot: File }) => Promise<void>;
}

// ========== COMPOSANT PRINCIPAL ==========

export function PaymentDialog({ open, onOpenChange, obligation, onPaymentSubmit }: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentOperator>('mtn');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>('pending');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const totalAmount = obligation.totalAmount ?? 0;

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
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    const input = document.getElementById('screenshot') as HTMLInputElement;
    if (input) input.value = '';
  };

  const handleSubmit = async () => {
    if (!screenshot) {
      toast.error('Veuillez télécharger une capture d\'écran du paiement');
      return;
    }
    setIsSubmitting(true);
    try {
      await onPaymentSubmit({ obligation, method: selectedMethod, screenshot });
      toast.success('Paiement soumis avec succès !');
      setStatus('pending');
      removeScreenshot();
      setTimeout(() => onOpenChange(false), 500);
    } catch (error) {
      toast.error('Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    removeScreenshot();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto p-0">
        {/* ====== EN-TÊTE ====== */}
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 sm:p-6 pb-3 sm:pb-4 border-b sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Wallet className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="break-words">Effectuer le paiement</span>
            </DialogTitle>
            <DialogDescription className="text-sm break-words">
              Choisissez votre moyen de paiement, suivez les instructions et téléchargez la capture.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* ====== CONTENU ====== */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Montant */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-3 sm:p-4 text-center border border-primary/10">
            <p className="text-xs sm:text-sm text-muted-foreground">Montant à payer</p>
            <p className="text-2xl sm:text-3xl font-bold text-primary break-words">
              {totalAmount.toLocaleString()} FCFA
            </p>
          </div>

          {/* Onglets */}
          <Tabs 
            defaultValue="mtn" 
            value={selectedMethod} 
            onValueChange={(v) => setSelectedMethod(v as PaymentOperator)}
            className="w-full flex flex-col"
          >
            <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 p-1 rounded-xl h-auto">
              {(['mtn', 'orange', 'wave'] as PaymentOperator[]).map((method) => {
                const isActive = selectedMethod === method;
                const config = PAYMENT_INSTRUCTIONS[method];
                return (
                  <TabsTrigger
                    key={method}
                    value={method}
                    className={cn(
                      'flex flex-col sm:flex-row items-center gap-0.5 sm:gap-1.5 py-2 sm:py-2.5 px-1 rounded-lg transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-md text-xs sm:text-sm',
                      isActive && 'ring-2 ring-primary/20'
                    )}
                  >
                    <span className={cn(
                      'p-0.5 rounded',
                      isActive ? config.color : 'text-muted-foreground'
                    )}>
                      {config.icon}
                    </span>
                    <span className="font-medium uppercase truncate">{method}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <AnimatePresence mode="wait">
              {(['mtn', 'orange', 'wave'] as PaymentOperator[]).map((method) => (
                <TabsContent key={method} value={method} className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gray-50/80 rounded-xl p-3 sm:p-4 space-y-3 border border-gray-100"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <span className="text-sm font-medium text-muted-foreground">Numéro de compte</span>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-sm font-mono px-3 sm:px-4 py-1 w-full sm:w-auto text-center break-all">
                        {PAYMENT_INSTRUCTIONS[method].account}
                      </Badge>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Instructions
                      </p>
                      <ol className="space-y-1.5">
                        {PAYMENT_INSTRUCTIONS[method].instructions.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">
                              {idx + 1}
                            </span>
                            <span className="break-words">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                </TabsContent>
              ))}
            </AnimatePresence>
          </Tabs>

          {/* Upload capture */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Image className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="break-words">Capture d'écran du paiement</span>
              <span className="text-xs text-muted-foreground font-normal flex-shrink-0">(obligatoire)</span>
            </Label>

            {previewUrl ? (
              <div className="relative rounded-lg border-2 border-green-200 bg-green-50/50 p-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                    <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0 w-full">
                    <p className="text-sm font-medium break-words">{screenshot?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(screenshot?.size || 0) > 1024 * 1024
                        ? `${((screenshot?.size || 0) / (1024 * 1024)).toFixed(1)} Mo`
                        : `${((screenshot?.size || 0) / 1024).toFixed(1)} Ko`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-red-500 flex-shrink-0 self-end sm:self-center"
                    onClick={removeScreenshot}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:text-sm file:font-medium file:bg-primary/10 file:text-primary file:border-0 file:rounded-md hover:file:bg-primary/20 text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1.5 break-words">
                  Formats : PNG, JPG, JPEG (max 5 Mo)
                </p>
              </div>
            )}
          </div>

          {/* Statut */}
          {status !== 'pending' && (
            <div className={cn(
              'flex items-center gap-2 p-3 rounded-lg border',
              STATUS_CONFIG[status].className
            )}>
              {STATUS_CONFIG[status].icon}
              <span className="text-sm font-medium break-words">{STATUS_CONFIG[status].label}</span>
            </div>
          )}

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t">
            <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto order-2 sm:order-1">
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !screenshot}
              className="gap-2 w-full sm:w-auto order-1 sm:order-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
                  Soumission...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 flex-shrink-0" />
                  Soumettre le paiement
                </>
              )}
            </Button>
          </div>

          {/* Note de sécurité */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-1">
            <Shield className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="break-words text-center">Votre paiement sera vérifié par un administrateur</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}