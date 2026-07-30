import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, RefreshCw, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface ExpiredTokenStateProps {
  onResend: () => void;
  email?: string;
}

export function ExpiredTokenState({ onResend, email }: ExpiredTokenStateProps) {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(`guardian email: ${email}`);
  }, [])
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-yellow-500/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader>
          <div className="flex justify-center">
            <div className="bg-yellow-500/10 p-4 rounded-full shadow-md">
              <Clock className="h-12 w-12 text-yellow-500" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl text-yellow-600">
            Lien expiré
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-center text-yellow-800">
              Le lien de confirmation a expiré (24h maximum).
              {email && (
                <span className="block mt-2 text-sm">
                  Un nouveau lien sera envoyé à : <strong>{email}</strong>
                </span>
              )}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={onResend}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Renvoyer le lien de confirmation
            </Button>
            <Button
              onClick={() => navigate('/contact')}
              variant="outline"
              className="w-full"
            >
              Contacter l'organisation
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}