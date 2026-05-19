import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const mockStats = {
  users: 45,
  pendingPayments: 3,
  pendingDocuments: 7,
  revenue: 1250,
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-heading text-primary">Administration</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle>Membres</CardTitle></CardHeader><CardContent>{mockStats.users}</CardContent></Card>
        <Card><CardHeader><CardTitle>Paiements en attente</CardTitle></CardHeader><CardContent>{mockStats.pendingPayments}</CardContent></Card>
        <Card><CardHeader><CardTitle>Documents à valider</CardTitle></CardHeader><CardContent>{mockStats.pendingDocuments}</CardContent></Card>
        <Card><CardHeader><CardTitle>CA mensuel</CardTitle></CardHeader><CardContent>{mockStats.revenue}€</CardContent></Card>
      </div>
    </div>
  );
}