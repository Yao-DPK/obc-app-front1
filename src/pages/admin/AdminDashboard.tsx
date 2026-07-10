// apps/web/src/pages/dashboard/SuperAdminDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, FileText, CreditCard } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { useUserStore } from '@/stores/useUserStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { PageHeader } from '@/components/ui/PageHeader';

export default function AdminDashboard() {
  const { users, fetchUsers } = useUserStore();
  const { pendingDocuments } = useDocumentStore();
  const { payments } = usePaymentStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalUsers = users.length;
  const pendingRegistrations = users.filter(
    u => u.registrationStatus === 'pre_inscrit' || u.registrationStatus === 'attestation_signee'
  ).length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Administration"
        description="Statistiques globales et surveillance du club"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Membres" value={totalUsers} icon={Users} />
        <StatCard title="Inscriptions en attente" value={pendingRegistrations} icon={UserPlus} color="text-orange-500" />
        <StatCard title="Documents à valider" value={pendingDocuments} icon={FileText} color="text-yellow-500" />
        <StatCard title="Paiements en attente" value={pendingPayments} icon={CreditCard} color="text-red-500" />
      </div>
    </motion.div>
  );
}