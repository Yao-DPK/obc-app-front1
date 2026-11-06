// src/lib/services/job.service.ts
import api from '@/lib/axios';
import type { MonthlyJobExecution, MonthlyJobIssue } from '@/types';

export const jobService = {
  async getStatus(): Promise<MonthlyJobExecution | null> {
    const { data } = await api.get('/api/admin/jobs/monthly/status');
    return data;
  },

  async getHistory(limit = 10): Promise<MonthlyJobExecution[]> {
    const { data } = await api.get('/api/admin/jobs/monthly/history', {
      params: { limit },
    });
    return data;
  },

  async getIssues(
    executionId: number,
    type?: 'skipped' | 'failed',
  ): Promise<MonthlyJobIssue[]> {
    const { data } = await api.get(
      `/api/admin/jobs/monthly/issues/${executionId}`,
      { params: type ? { type } : {} },
    );
    return data;
  },

  async runManual(): Promise<{ created: number; skipped: number; failed: number }> {
    const { data } = await api.post('/api/admin/jobs/monthly/run-manual');
    return data;
  },

  async retryIssues(issueIds: number[]): Promise<{
    resolved: number;
    stillFailed: number;
    errors: string[];
  }> {
    const { data } = await api.post('/api/admin/jobs/monthly/issues/retry', {
      issueIds,
    });
    return data;
  },
};