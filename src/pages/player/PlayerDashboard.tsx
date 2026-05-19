import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

export default function PlayerDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-primary">Mon espace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Prochain entraînement</CardTitle></CardHeader>
          <CardContent>Mercredi 10 mai à 18h</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
          <CardContent>Certificat médical à jour ✓</CardContent>
        </Card>
      </div>
    </div>
  );
}