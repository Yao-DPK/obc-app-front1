import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Users, Shield, FileText, CreditCard, TrendingUp } from 'lucide-react';
import { PageHeader } from './ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';

// Données mockées (à remplacer par des appels API)
const mockSuperStats = {
  totalUsers: 128,
  totalAdmins: 5,
  pendingRegistrations: 12,
  pendingDocuments: 8,
  pendingPayments: 3,
  revenue: 4850,
};

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Super Administration"
        description="Statistiques globales et surveillance du club"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Utilisateurs totaux" value={mockSuperStats.totalUsers} icon={Users} />
        <StatCard title="Administrateurs" value={mockSuperStats.totalAdmins} icon={Shield} color="text-purple-500" />
        <StatCard title="Inscriptions en attente" value={mockSuperStats.pendingRegistrations} icon={FileText} color="text-orange-500" />
        <StatCard title="Documents à valider" value={mockSuperStats.pendingDocuments} icon={FileText} color="text-yellow-500" />
        <StatCard title="Paiements en attente" value={mockSuperStats.pendingPayments} icon={CreditCard} color="text-red-500" />
        <StatCard title="CA mensuel (FCFA)" value={`${mockSuperStats.revenue.toLocaleString()}`} icon={TrendingUp} color="text-green-500" />
      </div>
      {/* Ici vous pouvez ajouter un graphique ou une liste des dernières activités */}
    </div>
  );
}