import { useState, useEffect, useRef } from 'react';
import type { User } from '@/types/user.type';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayerInfoForm } from '@/components/PlayerInfoForm';
import { PlayerDocuments } from '@/components/PlayerDocuments';
import { PaymentSection } from '@/components/PaymentSection';

interface RegistrationValidationPageProps {
  user: User;
}

export function RegistrationValidationPage({ user }: RegistrationValidationPageProps) {
  const [infoComplete, setInfoComplete] = useState(
    !!user.firstName && !!user.lastName && !!user.birthDate
  );
  const { documents, isLoading: docsLoading, fetchUserDocuments } = useDocumentStore();
  const documentsRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserDocuments(user.id);
  }, [user.id, fetchUserDocuments]);

  const hasDocuments = documents.length > 0;

  const handlePaymentSuccess = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
      {/* Section Informations */}
      <Card>
        <CardHeader>
          <CardTitle>1. Informations du joueur</CardTitle>
          <CardDescription>
            Complétez les informations personnelles du joueur.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerInfoForm user={user} />
        </CardContent>
      </Card>

      {/* Section Documents */}
      <Card ref={documentsRef}>
        <CardHeader>
          <CardTitle>2. Documents du joueur</CardTitle>
          <CardDescription>
            Téléversez les documents requis (certificat de naissance, certificat médical, photo).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlayerDocuments
            userId={user.id}
            documents={documents}
            isLoading={docsLoading}
          />
        </CardContent>
      </Card>

      {/* Section Paiement */}
      <Card ref={paymentRef}>
        <CardHeader>
          <CardTitle>3. Paiement</CardTitle>
          <CardDescription>
            Choisissez l'événement et le moyen de paiement pour finaliser l'inscription.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentSection
            userId={user.id}
            playerIds={[user.id]}
            onSuccess={handlePaymentSuccess}
            disabled={!infoComplete || !hasDocuments}
          />
        </CardContent>
      </Card>
    </div>
  );
}