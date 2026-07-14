import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Loader2, XCircle, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginConfirmFormProps {
  guardianData: {
    guardianEmail: string;
    guardianName: string;
    playerName: string;
  };
  isSubmitting: boolean;
  onConfirm: () => void;
  onReject: () => void;
}

export function LoginConfirmForm({
  guardianData,
  isSubmitting,
  onConfirm,
  onReject,
}: LoginConfirmFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full shadow-md">
              <UserCheck className="h-10 w-10 text-primary" />
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
              Vous avez déjà un compte OBC.
            </p>
            <p className="text-sm text-muted-foreground">
              Confirmez votre rôle de garant pour <strong>{guardianData.playerName}</strong>
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-start gap-3">
              <LogIn className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">
                  Compte déjà existant
                </p>
                <p className="text-sm text-green-700">
                  Vous êtes déjà enregistré chez OBC. Confirmez simplement votre rôle de garant pour ce joueur.
                </p>
                <p className="text-xs text-green-600 mt-2">
                  📧 Email : <strong>{guardianData.guardianEmail}</strong>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              🔐 En confirmant, vous acceptez d'être le garant responsable de ce joueur.
              Vous pourrez gérer son suivi depuis votre tableau de bord.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onConfirm}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirmation en cours...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Confirmer mon rôle de garant
                </>
              )}
            </Button>

            <Button
              onClick={onReject}
              variant="destructive"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Refuser cette responsabilité
            </Button>
          </div>

          <div className="text-center">
            <Link 
              to="/" 
              className="text-sm text-muted-foreground hover:text-primary transition inline-block"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}