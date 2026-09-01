// src/lib/services/paymentIntent.service.ts
import api from '../axios';
import type { PaymentIntent } from '@/types';

export type IntentFilters = {
  id?: number;
  obligationId?: number;
  userId?: number;
  status?: string | string[];
  method?: string | string[];
  createdFrom?: Date | string;
  createdTo?: Date | string;
  verifiedBy?: number;
  search?: string;
};

export const paymentIntentService = {
  // ========== LECTURE ==========

   async fetchIntents(filters?: IntentFilters): Promise<PaymentIntent[]> {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', String(filters.userId));
    if (filters?.obligationId) params.append('obligationId', String(filters.obligationId));
    if (filters?.status) params.append('status', String(filters.status));
    if (filters?.createdFrom) params.append('createdFrom', String(filters.createdFrom));
    if (filters?.createdTo) params.append('createdTo', String(filters.createdTo));

    const url = `/api/payments/intents/${params.toString() ? `?${params.toString()}` : ''}`;
    const { data } = await api.get(url);
    return data;
  },


  async getByObligation(obligationId: number): Promise<PaymentIntent[]> {
    const { data } = await api.get(`/api/payments/intents/obligation/${obligationId}`);
    return data;
  },

  async getPending(): Promise<PaymentIntent[]> {
    const { data } = await api.get('/api/payments/intents/pending');
    return data;
  },

  async getById(id: number): Promise<PaymentIntent> {
    const { data } = await api.get(`/api/payments/intents/${id}`);
    return data;
  },

  // ========== ACTIONS ADMIN ==========

  async verify(id: number, status: 'paid' | 'failed', rejectionReason?: string): Promise<void> {
    await api.patch(`/api/payments/intents/${id}/verify`, { status, rejectionReason });
  },

  // ========== CRÉATION (parent) ==========

  async create(formData: FormData): Promise<{ intentId: number; status: string }> {
    const { data } = await api.post('/api/payments/intents', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};