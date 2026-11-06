// src/pages/admin/AdminJobsPage.tsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { useJobStore } from '@/stores/useJobStore';

import { cn } from '@/lib/utils';
import { JobStatusCard } from './JobStatusCard';
import { IssuesList } from './IssuesList';
import { JobHistoryTable } from './JobHistoryTable';

export default function AdminJobsPage() {
  const {
    currentStatus,
    history,
    failedIssues,
    skippedIssues,
    isLoadingStatus,
    isLoadingHistory,
    isLoadingIssues,
    isRunning,
    isRetrying,
    error,
    fetchStatus,
    fetchHistory,
    runManual,
    retryIssues,
  } = useJobStore();

  useEffect(() => {
    fetchStatus();
    fetchHistory();
  }, []);

  const handleRun = async () => {
    try {
      const result = await runManual();
      toast.success(
        `Génération terminée : ${result.created} créées, ${result.skipped} sautées, ${result.failed} échouées`,
      );
      if (result.failed > 0) {
        toast.warning(`${result.failed} échec(s) — régénérez-les ci-dessous.`);
      }
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.error(err.response.data?.message || 'Génération déjà effectuée pour ce mois');
      } else {
        toast.error('Erreur lors de la génération');
      }
    }
  };

  const handleRetry = async (issueIds: number[]) => {
    try {
      const result = await retryIssues(issueIds);
      if (result.resolved > 0) {
        toast.success(`${result.resolved} échéance(s) régénérée(s)`);
      }
      if (result.stillFailed > 0) {
        toast.error(
          `${result.stillFailed} échec(s) persistant(s). Détail : ${result.errors.slice(0, 2).join(' | ')}`,
        );
      }
    } catch (err: any) {
      toast.error('Erreur lors de la régénération');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 mb-20">
      <PageHeader
        title="Tâches administratives"
        description="Génération et suivi des mensualités"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => Promise.all([fetchStatus(), fetchHistory()])}
          disabled={isLoadingStatus || isLoadingHistory}
          className="gap-2"
        >
          <RefreshCw
            className={cn('h-4 w-4', (isLoadingStatus || isLoadingHistory) && 'animate-spin')}
          />
          Actualiser
        </Button>
      </PageHeader>

      <JobStatusCard
        currentStatus={currentStatus}
        isLoading={isLoadingStatus}
        isRunning={isRunning}
        onRun={handleRun}
      />

      <IssuesList
        failedIssues={failedIssues}
        skippedIssues={skippedIssues}
        isLoading={isLoadingIssues}
        isRetrying={isRetrying}
        onRetry={handleRetry}
      />

      <JobHistoryTable history={history} isLoading={isLoadingHistory} />

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </motion.div>
  );
}