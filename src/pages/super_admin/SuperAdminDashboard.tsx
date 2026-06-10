// apps/web/src/pages/dashboard/SuperAdminDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, FileText, CreditCard, DollarSign, TrendingUp, UserPlus } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { useUserStore } from '@/stores/useUserStore';
import { useDocumentStore } from '@/stores/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function SuperAdminDashboard() {
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
  
  // Calcul du taux de recouvrement (estimation)
  const estimatedTotal = totalRevenue + (pendingPayments * 50000);
  const recoveryRate = estimatedTotal > 0 ? Math.round((totalRevenue / estimatedTotal) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title="Super Administration"
        description="Statistiques globales et surveillance du club"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard title="Membres" value={totalUsers} icon={Users} />
        <StatCard title="Administrateurs" value={totalAdmins} icon={Shield} color="text-purple-500" />
        <StatCard title="Inscriptions en attente" value={pendingRegistrations} icon={UserPlus} color="text-orange-500" />
        <StatCard title="Documents à valider" value={pendingDocuments} icon={FileText} color="text-yellow-500" />
        <StatCard title="Paiements en attente" value={pendingPayments} icon={CreditCard} color="text-red-500" />
        <StatCard title="CA mensuel (FCFA)" value={totalRevenue.toLocaleString()} icon={DollarSign} color="text-green-500" />
        <StatCard title="Taux de recouvrement" value={`${recoveryRate}%`} icon={TrendingUp} color="text-blue-500" />
      </div>
    </motion.div>
  );
}