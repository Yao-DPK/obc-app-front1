export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalPlayers: number;
  totalParents: number;
  pendingRegistrations: number;
  pendingDocuments: number; // 👈 Ajout
  totalObligations: number;
  totalAmountPaid: number;
  totalAmountRemaining: number;
  paidCount: number;
  pendingPaymentsCount: number;
  overdueCount: number;
}

export type JobExecutionStatus = 'running' | 'success' | 'failed';
export type JobIssueType = 'skipped' | 'failed';

export interface MonthlyJobExecution {
  id: number;
  targetMonth: string; // "2026-10"
  status: JobExecutionStatus;
  eventsCount: number;
  playersCount: number;
  createdCount: number;
  skippedCount: number;
  failedCount: number;
  executedBy: number | null;
  executedAt: string;
  completedAt: string | null;
  error: string | null;
}

export interface MonthlyJobIssue {
  id: number;
  executionId: number;
  playerId: number;
  eventId: number;
  type: JobIssueType;
  reason: string | null;
  resolvedAt: string | null;
  resolvedBy: number | null;
  createdAt: string;

  // Enrichissements optionnels (si le backend les joint)
  playerName?: string;
  eventName?: string;
}