
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Loader2, XCircle, Shield, User, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConfirmActionProps {
  guardianData: {
    guardianEmail: string;
    guardianName: string;
    playerName: string;
  };
  isSubmitting: boolean;
  onConfirm: () => void;
  onReject: () => void;
}

export function ConfirmAction({
  guardianData,
  isSubmitting,
  onConfirm,
  onReject,
}: ConfirmActionProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full shadow-md">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl text-primary">
            Confirmation de garant
          </CardTitle>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground">
              Bonjour <strong>{guardianData.guardianName}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Vous êtes sur le point de confirmer votre rôle de garant pour
            </p>
            <p className="text-lg font-semibold text-primary">
              {guardianData.playerName}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Informations sur la responsabilité */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  En tant que garant, vous vous engagez à :
                </p>
                <ul className="text-xs text-blue-700 space-y-1 mt-2 list-disc list-inside">
                  <li>Assurer le suivi de la participation du joueur</li>
                  <li>Être le point de contact principal pour l'organisation</li>
                  <li>Valider les engagements et autorisations nécessaires</li>
                  <li>Recevoir les communications importantes concernant le joueur</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">👤 Garant :</span>
              <span className="font-medium">{guardianData.guardianName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">✉️ Email :</span>
              <span className="font-medium">{guardianData.guardianEmail}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">⛹️ Joueur :</span>
              <span className="font-medium text-primary">{guardianData.playerName}</span>
            </div>
          </div>

          {/* Message d'avertissement */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              Cette action est irréversible. Une fois confirmé, vous serez officiellement le garant de ce joueur.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <Button
              onClick={onConfirm}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-12 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmation en cours...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-5 w-5" />
                  Confirmer ma position de garant
                </>
              )}
            </Button>

            <Button
              onClick={onReject}
              variant="destructive"
              className="w-full h-12 text-base"
              disabled={isSubmitting}
            >
              <XCircle className="mr-2 h-5 w-5" />
              Refuser cette responsabilité
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              ⏰ Ce lien expirera dans 24h
            </p>
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-primary transition mt-2 inline-block"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}