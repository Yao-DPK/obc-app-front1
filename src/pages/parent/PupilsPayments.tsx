// apps/web/src/pages/parent/ChildPayments.tsx
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard } from 'lucide-react';
import { useParams } from 'react-router-dom';

export const MOCK_PAYMENTS = [
  { id: 1, name: 'Inscription saison 2024-2025', description: "Frais d'inscription annuelle", montant: 50000, status: 'payé', playerId: 1 },
  { id: 2, name: 'Équipement', description: 'Maillot + short + ballon', montant: 25000, status: 'en_attente', playerId: 1 },
  { id: 3, name: "Camp d'été", description: 'Camp fermé Yamoussoukro', montant: 75000, status: 'en_retard', playerId: 2 },
  { id: 4, name: 'Équipement', description: 'Maillot + short + ballon', montant: 25000, status: 'en_attente', playerId: 2 },
  { id: 5, name: "Camp d'été", description: 'Camp fermé Yamoussoukro', montant: 75000, status: 'en_retard', playerId: 3 }
];

// Mapping des noms d'enfants (mock)
const CHILD_NAMES: Record<number, string> = {
  1: 'Kouadio Konan',
  2: 'Karine Konan',
  3: 'Yannick Bamba'
};

export default function ChildPaymentsPage() {
  const { id } = useParams<{ id: string }>();
  const playerId = Number(id);
  
  const payments = MOCK_PAYMENTS.filter(p => p.playerId === playerId);
  const childName = CHILD_NAMES[playerId] || 'Enfant';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payé':
        return <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">✅ Payé</span>;
      case 'en_attente':
        return <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">⏳ En attente</span>;
      case 'en_retard':
        return <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">⚠️ En retard</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 mb-20">
      <PageHeader
        title="Paiements"
        description={childName}
      />

      <Card>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun paiement</p>
              <p className="text-sm text-muted-foreground">Aucun paiement n'a encore été enregistré.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.name}</TableCell>
                    <TableCell>{payment.description}</TableCell>
                    <TableCell>{payment.montant.toLocaleString()} FCFA</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}