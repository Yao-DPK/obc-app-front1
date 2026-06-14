// apps/web/src/pages/dashboard/AdminDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, FileText, CreditCard, DollarSign, UserPlus } from 'lucide-react';
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
  const pendingRegistrations = users.filter(u => u.registrationStatus === 'pre_inscrit' || u.registrationStatus === 'attestation_signee').length;
  const pendingDocuments = documents.filter(d => !d.validatedAt).length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const totalRevenue = payments
    .filter(p => p.status === 'verified')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Administration"
        description="Gérez les inscriptions, documents et paiements du club"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Membres" value={totalUsers} icon={Users} />
        <StatCard title="Administrateurs" value={totalAdmins} icon={Shield} color="text-purple-500" />
        <StatCard title="Inscriptions en attente" value={pendingRegistrations} icon={UserPlus} color="text-orange-500" />
        <StatCard title="Documents à valider" value={pendingDocuments} icon={FileText} color="text-yellow-500" />
        <StatCard title="Paiements en attente" value={pendingPayments} icon={CreditCard} color="text-red-500" />
        <StatCard title="CA mensuel (FCFA)" value={totalRevenue.toLocaleString()} icon={DollarSign} color="text-green-500" />
      </div>
    </motion.div>
  );
}