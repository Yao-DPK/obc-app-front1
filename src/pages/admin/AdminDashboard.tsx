// apps/web/src/pages/dashboard/AdminDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CreditCard, DollarSign, Clock, Shield } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { useUserStore } from '@/stores/useUserStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AdminDashboard() {
  const { users, fetchUsers } = useUserStore();
  const { documents, fetchDocuments } = useDocumentStore();
  const { payments, fetchPayments } = usePaymentStore();

  useEffect(() => {
    fetchUsers();
    fetchDocuments();
    fetchPayments();
  }, []);

  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
  //const totalPlayers = users.filter(u => u.role === 'player').length;
  //const totalParents = users.filter(u => u.role === 'parent').length;

  const pendingDocuments = documents.filter(d => !d.validatedAt).length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const totalRevenue = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <PageHeader
        title="Administration"
        description="Gérez les inscriptions, documents et paiements du club"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Membres"
          value={totalUsers}
          icon={Users}
        />
        <StatCard
          title="Admins"
          value={totalAdmins}
          icon={Shield}
          color="text-purple-500"
        />
        <StatCard
          title="Documents en attente"
          value={pendingDocuments}
          icon={FileText}
          color="text-yellow-500"
        />
        <StatCard
          title="Paiements en attente"
          value={pendingPayments}
          icon={CreditCard}
          color="text-red-500"
        />
        <StatCard
          title="CA mensuel"
          value={`${totalRevenue.toLocaleString()} FCFA`}
          icon={DollarSign}
          color="text-green-500"
        />
        <StatCard
          title="Inscriptions récentes"
          value={users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length}
          icon={Clock}
          color="text-blue-500"
        />
      </div>
      {/* Vous pouvez ajouter un graphique ici */}
    </motion.div>
  );
}