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