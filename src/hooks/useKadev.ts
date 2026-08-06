import { useEffect, useState } from 'react';
import { toast } from 'sonner';


declare global {
  interface Window {
    KadevPay: any;
  }
}

export interface PaymentMetadata {
  phone?: string;
  cart_id?: string;
  custom_field?: string;
}

export interface PaymentDetails {
  montant: number;
  email: string;
  name?: string;
  phone?: string;
  method: string;
  callback_url?: string;
  metadata?: PaymentMetadata;
}




export function useKadev() {
  const [paymentDetails, setPaymentDetails] = useState({
    montant: 0,
    email: '',
    name: '',
    phone: '',
    method: '',
    metadata: { phone: ''}
  });


  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

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
            cart_id: 'CMD-9982',
            custom_field: 'valeur'
          },
          onSuccess: function(response: any) {
            toast.success('Paiement réussi !');
            console.log(`Payment reussi: ${JSON.stringify(response)}`);
            
            return response;
            // Redirection ou autre action
          },
          onClose: function() {
            toast.info('Paiement annulé');
          }
        });
      };
    
  return {
    paymentDetails,
    setPaymentDetails, 
    isLoading,
    setIsLoading,
    scriptLoaded, 
    setScriptLoaded, 
    handlePayment,
  };
}