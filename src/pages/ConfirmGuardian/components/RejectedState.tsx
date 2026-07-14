import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RejectedStateProps {
  playerName: string;
}

export function RejectedState({ playerName }: RejectedStateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 via-background to-red-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-red-500/30 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader>
          <div className="flex justify-center">
            <div className="bg-red-500/10 p-4 rounded-full shadow-md">
              <UserX className="h-14 w-14 text-red-500" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl text-red-600">
            Responsabilité refusée
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-center text-red-800">
              Vous avez refusé la responsabilité de garant pour <strong>{playerName}</strong>
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800 text-center">
              L'organisation a été notifiée de votre refus.
              Les parents du joueur vont être contactés pour désigner un autre garant.
            </p>
          </div>

          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}