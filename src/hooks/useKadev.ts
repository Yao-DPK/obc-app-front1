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
  obligationId: number;
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

    const handlePayment = (details: PaymentDetails): Promise<any> => {
      return new Promise((resolve, reject) => {
        if (!window.KadevPay) {
          toast.error('Module de paiement non chargé. Rafraîchissez la page.');
          reject(new Error('KadevPay not loaded'));
          return;
        }

        const tax_free_amount = details.montant;

        window.KadevPay.checkout({
          public_key: import.meta.env.VITE_KADEV_PUBLIC_KEY,
          amount: tax_free_amount,
          email: details.email,
          name: details.name || '',
          phone: details.phone || '',
          method: details.method,
          callback_url: details.callback_url || '',
          metadata: {
            cart_id: 'CMD-9982',
            custom_field: 'valeur',
            ...details.metadata,
          },
          onSuccess: function (response: any) {
            toast.success('Paiement réussi !');
            resolve(response); // ✅ résout la promesse
          },
          onClose: function () {
            toast.info('Paiement annulé');
            reject(new Error('Paiement annulé par l\'utilisateur')); // ✅ rejette
          },
        });
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