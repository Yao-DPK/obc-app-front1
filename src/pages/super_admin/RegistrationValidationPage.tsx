// src/pages/RegistrationValidationPage.tsx
import { useState, useEffect, useRef } from 'react';
import type { User } from '@/types/user.type';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerInfoForm } from '@/components/PlayerInfoForm';
import { PlayerDocuments } from '@/components/PlayerDocuments';
import { PaymentSection } from '@/components/PaymentSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { inscriptionService } from '@/lib/services/inscription.service';
import { toast } from 'sonner';

interface RegistrationValidationPageProps {
  user: User;
}

export function RegistrationValidationPage({ user }: RegistrationValidationPageProps) {
  const { documents, isLoading: docsLoading, fetchUserDocuments } = useDocumentStore();
  const { fetchObligations } = usePaymentStore();
  const documentsRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const [isInfoValid, setIsInfoValid] = useState(false);
  const [isDocsValid, setIsDocsValid] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  useEffect(() => {
    fetchUserDocuments(user.id);
    fetchObligations(user.id);
  }, [user.id, fetchUserDocuments, fetchObligations]);

  const allValidated = isInfoValid && isDocsValid && isPaymentValid;

  const validateRegistration = async ()=> {
    try {
      await inscriptionService.validateRegistration(user.id);
      toast.success("Inscription Validée");
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'inscription');
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8 mb-5">
      {/* Section Informations */}
      <Card>
        <CardHeader>
          <CardTitle className='flex gap-2'>
            Informations du joueur

            <div className="flex items-center gap-2">
            {isInfoValid ? (
              <Badge className="bg-green-600">Valide</Badge>
            ) : (
              <Badge variant="destructive">Invalide</Badge>
            )}
          </div>

          </CardTitle>
          <CardDescription>
            Vérifier les informations personnelles du joueur.
          </CardDescription>

          
        </CardHeader>
        <CardContent>
          <PlayerInfoForm user={user} onValidChange={setIsInfoValid}/>
        </CardContent>
      </Card>

      {/* Section Documents */}
      <Card ref={documentsRef}>
        <CardHeader>
          <CardTitle className='flex gap-2'>
            Documents du joueur
          <div className="flex items-center gap-2">
            {isDocsValid ? <Badge className="bg-green-600">Valide</Badge> : <Badge variant="secondary">Invalide</Badge>}
          </div>
          </CardTitle>
          
          <CardDescription>
            Téléversez les documents requis (certificat de naissance, certificat médical, photo).
          </CardDescription>
          
        </CardHeader>
        <CardContent>
          <PlayerDocuments
            userId={user.id}
            documents={documents}
            isLoading={docsLoading}
            onSuccess={() => fetchUserDocuments(user.id)}
            onValidChange={setIsDocsValid}
          />
        </CardContent>
      </Card>

      {/* Section Paiement */}
      <Card ref={paymentRef}>
        <CardHeader>
          <CardTitle className='flex gap-2'>
            Paiement

            <div className="flex items-center gap-2">
            {isPaymentValid ? (
              <Badge className="bg-green-600">Valide</Badge>
            ) : (
              <Badge variant="secondary">Invalide</Badge>
            )}
          </div>

          </CardTitle>
          <CardDescription>
            Vérifiez les paiements de l'utilisateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentSection
            playerId={user.id}
            onValidChange={setIsPaymentValid}
          />
        </CardContent>
      </Card>
      
      <Button onClick={validateRegistration} disabled={!allValidated}>
        Valider l'inscription
      </Button>

    </div>
  );
}