import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const mockChildren = [
  { id: 1, name: 'Thomas', status: 'inscrit', documents: 2, paiement: 'à jour' },
  { id: 2, name: 'Léa', status: 'inscrite', documents: 3, paiement: 'en retard' },
];

export default function ParentDashboard() {
  const { user } = useAuth();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-primary">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Enfants</CardTitle></CardHeader>
          <CardContent>{mockChildren.length} inscrits</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Documents</CardTitle></CardHeader>
          <CardContent>⚠️ 1 document manquant</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Paiements</CardTitle></CardHeader>
          <CardContent>Mensualité mai : 49€</CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Vos enfants</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mockChildren.map(child => (
              <li key={child.id} className="flex justify-between border-b pb-2">
                <span>{child.name}</span>
                <span className="text-sm text-muted-foreground">{child.paiement}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}