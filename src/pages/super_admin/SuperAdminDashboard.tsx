// src/pages/dashboard/SuperAdminDashboard.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Shield,
  UserPlus,
  FileText,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { useUserStore } from '@/stores/useUserStore';
import { useDocumentStore } from '@/stores/documents/useDocumentStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function SuperAdminDashboard() {
  // ========== STORES ==========
  const { users, fetchUsers, isLoading: usersLoading } = useUserStore();
  const { pendingDocuments, fetchPendingDocuments, isLoading: docsLoading} = useDocumentStore();
  const {
    summary,
    fetchSummary,
    fetchObligations,
    fetchIntents,
    fetchAllObligations, fetchAllIntents, allObligations, allIntents,
    isLoadingObligations,
    isLoadingIntents,
  } = usePaymentStore();

  // ========== CHARGEMENT ==========
  useEffect(() => {
  }, []);

  // ========== CALCULS ==========
  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length;
  const totalPlayers = users.filter(u => u.role === 'player').length;
  const totalParents = users.filter(u => u.role === 'parent').length;

  const pendingRegistrations = users.filter(
    u => u.registrationStatus === 'pre_inscrit' || u.registrationStatus === 'attestation_signee'
  ).length;

  const totalObligations = summary?.totalObligations || 0;
  const totalAmountPaid = summary?.totalPaid || 0;
  const totalAmountRemaining = summary?.totalRemaining || 0;
  const paidCount = summary?.statusCounts?.paid || 0;
  const pendingPaymentsCount = summary?.statusCounts?.pending || 0;
  const overdueCount = summary?.statusCounts?.overdue || 0;

  const isLoading = usersLoading || docsLoading || isLoadingObligations || isLoadingIntents;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 mb-20"
    >
      <PageHeader
        title="Supervision"
        description="Statistiques globales et surveillance du club"
      />

      {/* ====== SECTION : RÉSUMÉ GLOBAL ====== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Membres"
          value={totalUsers}
          icon={Users}
          color="text-primary"
          subtitle={`${totalPlayers} joueurs • ${totalParents} parents`}
        />
        <StatCard
          title="Administrateurs"
          value={totalAdmins}
          icon={Shield}
          color="text-purple-500"
          subtitle="Super Admin + Admins"
        />
        <StatCard
          title="Inscriptions en attente"
          value={pendingRegistrations}
          icon={UserPlus}
          color="text-orange-500"
          subtitle="En attente de validation"
        />
        <StatCard
          title="Documents à valider"
          value={pendingDocuments}
          icon={FileText}
          color="text-yellow-500"
          subtitle="En attente de vérification"
        />
      </div>

      {/* ====== SECTION : PAIEMENTS ====== */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          📊 Paiements
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Montant total payé"
            value={`${totalAmountPaid.toLocaleString()} FCFA`}
            icon={DollarSign}
            color="text-green-500"
            subtitle={`${paidCount} paiements validés`}
          />
          <StatCard
            title="Reste à payer"
            value={`${totalAmountRemaining.toLocaleString()} FCFA`}
            icon={TrendingUp}
            color="text-blue-500"
            subtitle={`${totalObligations} obligations totales`}
          />
          <StatCard
            title="Paiements en attente"
            value={pendingPaymentsCount}
            icon={Clock}
            color="text-amber-500"
            subtitle="En attente de validation"
          />
          <StatCard
            title="Paiements en retard"
            value={overdueCount}
            icon={AlertCircle}
            color="text-red-500"
            subtitle="À régulariser"
          />
        </div>
      </div>

      {/* ====== SECTION : ACTIVITÉ RÉCENTE (WIP) ====== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{totalPlayers} joueurs</span> actifs cette saison
              </p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{pendingRegistrations} inscriptions</span> en attente de validation
              </p>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{pendingDocuments} documents</span> à vérifier
              </p>
            </div>
            {overdueCount > 0 && (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">
                  ⚠️ <span className="font-medium">{overdueCount} paiements</span> sont en retard
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ====== INDICATEUR DE SANTÉ ====== */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <span className="text-sm font-medium text-gray-600">État global :</span>
        <div className="flex flex-wrap gap-3">
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Sain</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">{pendingRegistrations} inscriptions en attente</span>
          </span>
          <span className="flex items-center gap-1.5 text-sm">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-muted-foreground">{overdueCount} paiements en retard</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}