import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from '../components/ui/label';
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { PaymentMethodSelector } from "./ui/paymentMethodSelector";

// Déclarer KadevPay globalement pour TypeScript
declare global {
  interface Window {
    KadevPay: any;
  }
}

interface PaymentMetadata {
  cart_id: string;
  custom_field?: string;
}

interface PaymentDetails {
  montant: number;
  email: string;
  name?: string;
  phone?: string;
  method: string;
  callback_url?: string;
  metadata: PaymentMetadata;
}

export function PaymentComponent() {
  const [paymentDetails, setPaymentDetails] = useState({
    montant: 0,
    email: '',
    name: '',
    phone: '',
    method: '',
    metadata: { cart_id: '', custom_field: '' }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Chargement du script avec vérification
  useEffect(() => {
    if (document.querySelector('script[src="https://pay.kadev.ci/js/v1/kadev-pay.js"]')) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://pay.kadev.ci/js/v1/kadev-pay.js';
    script.async = true;
    script.onload = () => {
      console.log('KadevPay script loaded');
      setScriptLoaded(true);
    };
    script.onerror = () => {
      toast.error('Erreur de chargement du module de paiement');
    };
    document.body.appendChild(script);

    return () => {
      // Ne pas supprimer le script si on risque de le retirer alors qu'un autre composant l'utilise
      // document.body.removeChild(script); // À éviter si plusieurs instances
    };
  }, []);

  const handlePayment = async (details: PaymentDetails) => {
    if (!window.KadevPay) {
      toast.error('Module de paiement non chargé. Rafraîchissez la page.');
      return;
    }

    const tax_free_amount = details.montant
   

    window.KadevPay.checkout({
      public_key: import.meta.env.VITE_KADEV_PUBLIC_KEY, // Attention: VITE_ préfixe
      amount: tax_free_amount,
      email: details.email,
      name: details.name || '',
      phone: details.phone || '',
      method: details.method,        // Utilisation de la méthode choisie
      callback_url: details.callback_url || '',
      metadata: {
        cart_id: details.metadata.cart_id,
        custom_field: details.metadata.custom_field || ''
      },
      onSuccess: function(response: any) {
        console.log("Paiement validé ! Référence : ", response.reference);
        toast.success('Paiement réussi !');
        // Redirection ou autre action
      },
      onClose: function() {
        console.log("Le client a abandonné le paiement.");
        toast.info('Paiement annulé');
      }
    });
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!paymentDetails.montant || paymentDetails.montant <= 0) {
      toast.error('Montant invalide');
      return;
    }
    if (!paymentDetails.email) {
      toast.error('Email requis');
      return;
    }
    if (!paymentDetails.method) {
      toast.error('Choisissez un moyen de paiement');
      return;
    }
    if (!scriptLoaded) {
      toast.error('Le système de paiement n\'est pas encore prêt. Patientez...');
      return;
    }

    setIsLoading(true);
    try {
      await handlePayment({
        montant: paymentDetails.montant,
        email: paymentDetails.email,
        name: paymentDetails.name,
        phone: paymentDetails.phone,
        method: paymentDetails.method,
        metadata: paymentDetails.metadata
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erreur lors du paiement';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Gestion des champs input classiques
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'montant') {
      setPaymentDetails(prev => ({ ...prev, montant: parseFloat(value) || 0 }));
    } else {
      setPaymentDetails(prev => ({ ...prev, [id]: value }));
    }
  };

  // Gestion du select
  const handleMethodChange = (value: string) => {
    setPaymentDetails(prev => ({ ...prev, method: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div>
            <Label htmlFor="montant">Montant (FCFA)</Label>
            <Input
              id="montant"
              type="number"
              placeholder="4500"
              value={paymentDetails.montant || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nom@gmail.com"
              value={paymentDetails.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="name">Nom complet (optionnel)</Label>
            <Input
              id="name"
              type="text"
              placeholder="Paul"
              value={paymentDetails.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="phone">Téléphone (optionnel)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0102030405"
              value={paymentDetails.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="method">Moyen de paiement</Label>
            <PaymentMethodSelector 
              value={paymentDetails.method} 
              onChange={handleMethodChange} 
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-secondary text-primary hover:bg-secondary/90"
            disabled={isLoading || !scriptLoaded}
          >
            {isLoading ? 'Paiement en cours...' : 'Payer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}