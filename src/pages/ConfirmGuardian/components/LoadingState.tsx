import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl backdrop-blur-sm bg-white/95">
        <CardHeader>
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
          <CardTitle className="text-center text-xl text-muted-foreground">
            Vérification de votre demande...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full animate-pulse w-1/2" />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Patientez pendant que nous vérifions votre lien de confirmation
          </p>
        </CardContent>
      </Card>
    </div>
  );
}