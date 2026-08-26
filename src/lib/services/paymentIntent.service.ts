// src/lib/services/paymentIntent.service.ts
import api from '../axios';
import type { PaymentIntent } from '@/types';

export const paymentIntentService = {
  // ========== LECTURE ==========

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