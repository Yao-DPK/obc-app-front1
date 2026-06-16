// src/lib/services/payment.service.ts
import api from '@/lib/axios';
import type {
  PaymentObligation,
  CreatePaymentObligationDto,
  UpdatePaymentObligationDto,
  IntentResponse,
  IntentStatusResponse,
  PaymentEvent,
  CreatePaymentEventDto,
  UpdatePaymentEventDto,
  CreateIntentPayload,
} from '@/types';

export const paymentService = {
  // ========== Payment Obligations ==========
  async createObligation(data: CreatePaymentObligationDto): Promise<PaymentObligation> {
    const response = await api.post('/payment-obligations', data);
    return response.data;
  },

  async getAllObligations(): Promise<PaymentObligation[]> {
    const response = await api.get('/api/payment-obligations');
    return response.data;
  },

  async getObligationsByPlayer(playerId: number): Promise<PaymentObligation[]> {
    const response = await api.get(`/api/payment-obligations/player/${playerId}`);
    return response.data;
  },

  async getObligationById(id: number): Promise<PaymentObligation> {
    const response = await api.get(`/payment-obligations/${id}`);
    return response.data;
  },

  async updateObligation(id: number, data: UpdatePaymentObligationDto): Promise<PaymentObligation> {
    const response = await api.put(`/payment-obligations/${id}`, data);
    return response.data;
  },

  async deleteObligation(id: number): Promise<void> {
    await api.delete(`/payment-obligations/${id}`);
  },

  async updateObligationStatus(id: number, status: string): Promise<PaymentObligation> {
    const response = await api.patch(`/payment-obligations/${id}/status`, { status });
    return response.data;
  },

  // ========== Payment Intents (Kadev Pay) ==========
  async createIntent(data: CreateIntentPayload): Promise<IntentResponse> {
    const response = await api.post('/payment-intents', data);
    return response.data;
  },

  async getIntentStatus(intentId: number): Promise<IntentStatusResponse> {
    const response = await api.get(`/payment-intents/${intentId}/status`);
    return response.data;
  },

  // ========== Payment Events (Admin) ==========
  async createEvent(data: CreatePaymentEventDto): Promise<PaymentEvent> {
    const response = await api.post('/admin/payment-events', data);
    return response.data;
  },

  async getAllEvents(includeInactive = false): Promise<PaymentEvent[]> {
    const response = await api.get(`/admin/payment-events?includeInactive=${includeInactive}`);
    return response.data;
  },

  async getEventById(id: number): Promise<PaymentEvent> {
    const response = await api.get(`/admin/payment-events/${id}`);
    return response.data;
  },

  async updateEvent(id: number, data: UpdatePaymentEventDto): Promise<PaymentEvent> {
    const response = await api.patch(`/admin/payment-events/${id}`, data);
    return response.data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/admin/payment-events/${id}`);
  },

  // ========== Public payment events ==========
  async getActiveEvents(): Promise<PaymentEvent[]> {
    const response = await api.get('/payment-events');
    return response.data;
  },
};