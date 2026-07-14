import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail, UserCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SuccessStateProps {
  guardianData: {
    guardianEmail: string;
    guardianName: string;
    playerName: string;
  } | null;
}

export function SuccessState({ guardianData }: SuccessStateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-background to-green-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-green-500/30 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader>
          <div className="flex justify-center">
            <div className="bg-green-500/10 p-4 rounded-full shadow-md animate-bounce">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl text-green-600">
            ✅ Félicitations !
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="bg-green-50 p-5 rounded-lg border border-green-200 space-y-2">
            <p className="text-center text-green-800 font-medium text-lg">
              Vous êtes maintenant le garant de <strong>{guardianData?.playerName}</strong>
            </p>
            {guardianData?.guardianEmail && (
              <p className="text-center text-sm text-green-600 flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                Un email de confirmation a été envoyé à {guardianData.guardianEmail}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-11"
            >
              <UserCheck className="mr-2 h-4 w-4" />
              Accéder à mon tableau de bord
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-full"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Découvrir OBC
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Vous serez automatiquement redirigé dans quelques secondes...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}