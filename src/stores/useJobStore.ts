// src/stores/useJobStore.ts
import { create } from 'zustand';
import { jobService } from '@/lib/services/job.service';
import type { MonthlyJobExecution, MonthlyJobIssue } from '@/types';

interface JobStore {
  // ========== ÉTATS ==========
  currentStatus: MonthlyJobExecution | null;
  history: MonthlyJobExecution[];
  failedIssues: MonthlyJobIssue[];
  skippedIssues: MonthlyJobIssue[];

  isLoadingStatus: boolean;
  isLoadingHistory: boolean;
  isLoadingIssues: boolean;
  isRunning: boolean;
  isRetrying: boolean;
  error: string | null;

  // ========== ACTIONS ==========
  fetchStatus: () => Promise<void>;
  fetchHistory: (limit?: number) => Promise<void>;
  fetchIssues: (executionId: number) => Promise<void>;
  runManual: () => Promise<{ created: number; skipped: number; failed: number }>;
  retryIssues: (issueIds: number[]) => Promise<{
    resolved: number;
    stillFailed: number;
    errors: string[];
  }>;
  reset: () => void;
}

export const useJobStore = create<JobStore>((set, get) => ({
  currentStatus: null,
  history: [],
  failedIssues: [],
  skippedIssues: [],

  isLoadingStatus: false,
  isLoadingHistory: false,
  isLoadingIssues: false,
  isRunning: false,
  isRetrying: false,
  error: null,

  // ============================================================
  // RÉCUPÉRATION
  // ============================================================

  fetchStatus: async () => {
    set({ isLoadingStatus: true, error: null });
    try {
      const status = await jobService.getStatus();
      set({ currentStatus: status, isLoadingStatus: false });

      // Charger automatiquement les issues si l'exécution existe
      if (status) {
        await get().fetchIssues(status.id);
      } else {
        set({ failedIssues: [], skippedIssues: [] });
      }
    } catch (error: any) {
      set({ error: error.message, isLoadingStatus: false });
    }
  },

  fetchHistory: async (limit = 10) => {
    set({ isLoadingHistory: true, error: null });
    try {
      const history = await jobService.getHistory(limit);
      set({ history, isLoadingHistory: false });
    } catch (error: any) {
      set({ error: error.message, isLoadingHistory: false });
    }
  },

  fetchIssues: async (executionId: number) => {
    set({ isLoadingIssues: true, error: null });
    try {
      const [failed, skipped] = await Promise.all([
        jobService.getIssues(executionId, 'failed'),
        jobService.getIssues(executionId, 'skipped'),
      ]);
      set({
        failedIssues: failed,
        skippedIssues: skipped,
        isLoadingIssues: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoadingIssues: false });
    }
  },

  // ============================================================
  // ACTIONS
  // ============================================================

  runManual: async () => {
    set({ isRunning: true, error: null });
    try {
      const result = await jobService.runManual();
      await Promise.all([
        get().fetchStatus(),
        get().fetchHistory(),
      ]);
      return result;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isRunning: false });
    }
  },

  retryIssues: async (issueIds: number[]) => {
    set({ isRetrying: true, error: null });
    try {
      const result = await jobService.retryIssues(issueIds);
      await Promise.all([
        get().fetchStatus(),
        get().fetchHistory(),
      ]);
      return result;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ isRetrying: false });
    }
  },

  reset: () =>
    set({
      currentStatus: null,
      history: [],
      failedIssues: [],
      skippedIssues: [],
      isLoadingStatus: false,
      isLoadingHistory: false,
      isLoadingIssues: false,
      isRunning: false,
      isRetrying: false,
      error: null,
    }),
}));