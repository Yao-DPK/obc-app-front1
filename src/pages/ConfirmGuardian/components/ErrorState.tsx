import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, Mail } from 'lucide-react';

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-background to-red-50 p-4">
      <Card className="w-full max-w-md shadow-2xl border-destructive/20 rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader>
          <div className="flex justify-center">
            <div className="bg-destructive/10 p-4 rounded-full shadow-md">
              <AlertCircle className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl text-destructive">
            Lien invalide
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-destructive/5 p-4 rounded-lg border border-destructive/20">
            <p className="text-center text-muted-foreground">
              {message || 'Le lien de confirmation est invalide. Veuillez vérifier que vous avez copié le lien correctement.'}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/contact')}
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contacter l'organisation
            </Button>
            <Button
              onClick={() => navigate('/')}
              variant="outline"
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