import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Smartphone, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import type { IntentResponse, PaymentEvent } from '@/types';
import { paymentService } from '@/lib/services/payment.service';

declare global {
  interface Window {
    KadevPay: any;
  }
}

interface PaymentSectionProps {
  userId: number;
  playerIds?: number[];
  onSuccess: () => void;
  disabled?: boolean; // nouvelle prop

}

export function PaymentSection({ userId, playerIds, onSuccess, disabled = false }: PaymentSectionProps) {
  const [events, setEvents] = useState<PaymentEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'momo' | 'card'>('momo');
  const [intent, setIntent] = useState<IntentResponse | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Charger les événements actifs
  useEffect(() => {
    paymentService.getActiveEvents().then(setEvents).catch(console.error);
  }, []);

  // Charger le script Kadev Pay
  useEffect(() => {
    if (document.querySelector('script[src="https://pay.kadev.ci/js/v1/kadev-pay.js"]')) {
      setIsScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://pay.kadev.ci/js/v1/kadev-pay.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => toast.error('Erreur de chargement du module de paiement');
    document.body.appendChild(script);
  }, []);

  const selectedEvent = events.find(e => e.id === selectedEventId);
  const feeRate = paymentMethod === 'momo' ? 0.023 : 0.045;
  const amount = selectedEvent ? parseFloat(selectedEvent.amount) : 0;
  const fees = amount * feeRate;
  const total = amount + fees;

  const handleCreateIntent = async () => {
    if (!selectedEventId) {
      toast.error('Veuillez choisir un événement');
      return;
    }
    setIsCreatingIntent(true);
    try {
      const intentData = await paymentService.createIntent({
        eventId: selectedEventId,
        paymentMethod,
        playerIds,
      });
      setIntent(intentData);
    } catch (error) {
      toast.error('Erreur lors de la préparation du paiement');
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handlePay = () => {
    if (!intent || !window.KadevPay) return;

    window.KadevPay.checkout({
      public_key: intent.publicKey,
      amount: parseInt(intent.totalAmount), // Kadev Pay attend un entier (FCFA)
      email: (window as any).userEmail || 'client@example.com', // à remplacer par l'email réel
      name: 'Client', // à personnaliser
      phone: '0102030405', // à récupérer
      method: paymentMethod,
      callback_url: `${window.location.origin}/payment/return`,
      metadata: {
        intent_id: intent.intentId,
      },
      onSuccess: (response: any) => {
        console.log('Paiement réussi', response);
        // Polling du statut
        const checkStatus = setInterval(async () => {
          const status = await paymentService.getIntentStatus(intent.intentId);
          if (status.status === 'paid') {
            clearInterval(checkStatus);
            toast.success('Inscription finalisée !');
            onSuccess();
          }
        }, 2000);
      },
      onClose: () => {
        toast.info('Paiement annulé');
      },
    });
  };

  if (!events.length) {
    return <div className="text-center py-8">Chargement des tarifs...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Événement / Inscription</Label>
        <Select onValueChange={(val) => setSelectedEventId(parseInt(val))}>
          <SelectTrigger>
            <SelectValue placeholder="Choisissez un type d'inscription" />
          </SelectTrigger>
          <SelectContent>
            {events.map(event => (
              <SelectItem key={event.id} value={event.id.toString()}>
                {event.name} - {parseFloat(event.amount).toLocaleString()} FCFA
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedEvent && (
        <>
          <div>
            <Label>Moyen de paiement</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(val:any) => setPaymentMethod(val as 'momo' | 'card')}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="momo" id="momo" />
                <Label htmlFor="momo" className="flex items-center gap-2">
                  <Smartphone size={18} /> Mobile Money (2.3% frais)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center gap-2">
                  <CreditCard size={18} /> Carte Bancaire (4.5% frais)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="flex justify-between">
                <span>Montant de l'événement :</span>
                <span>{amount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Frais ({paymentMethod === 'momo' ? '2.3%' : '4.5%'}) :</span>
                <span>{fees.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total à payer :</span>
                <span>{total.toLocaleString()} FCFA</span>
              </div>
            </CardContent>
          </Card>

          {!intent ? (
            <Button
              className="w-full"
              onClick={handleCreateIntent}
              disabled={isCreatingIntent || !isScriptLoaded}
            >
              {isCreatingIntent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Préparer le paiement
            </Button>
          ) : (
            <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handlePay}>
              Payer {total.toLocaleString()} FCFA
            </Button>
          )}
        </>
      )}
    </div>
  );
}