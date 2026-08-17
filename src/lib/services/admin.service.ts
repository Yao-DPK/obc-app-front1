import api from '../axios';
import type { DashboardStats } from '@/types';

export const adminService = {
  async getDashboardStats(): Promise<DashboardStats> {
    const { data } = await api.get('/api/admin/dashboard/stats');
    return data;
  },
};