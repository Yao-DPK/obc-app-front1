// src/lib/services/payment.service.ts
import api from '@/lib/axios';
import type {
  PaymentObligation,
  CreateObligationDto,
  PaymentIntent,
  PaymentEvent,
  PaymentSummary,
  VerifyPaymentDto,
  UpdatePaymentEventDto,
  CreatePaymentEventDto,
} from '@/types';

export interface GetObligationsOptions {
  playerIds?: number[];
}

export const paymentService = {
  // ============================================================
  // ÉVÉNEMENTS
  // ============================================================

  async getActiveEvents(): Promise<PaymentEvent[]> {
    const { data } = await api.get('/api/payments/events');
    return data;
  },

  async getEventById(id: number): Promise<PaymentEvent> {
    const { data } = await api.get(`/api/payments/events/${id}`);
    return data;
  },

  // ============================================================
  // OBLIGATIONS
  // ============================================================

  async createObligation(dto: CreateObligationDto): Promise<PaymentObligation> {
    const { data } = await api.post('/api/payments/obligations', dto);
    return data;
  },

  async getMyObligations(): Promise<PaymentObligation[]> {
    const { data } = await api.get('/api/payments/obligations');
    return data;
  },

  async getObligationById(id: number): Promise<PaymentObligation> {
    const { data } = await api.get(`/api/payments/obligations/${id}`);
    return data;
  },
  

  async cancelObligation(id: number): Promise<PaymentObligation> {
    const { data } = await api.patch(`/api/payments/obligations/${id}/cancel`);
    return data;
  },

  async getObligations(options: GetObligationsOptions = {}): Promise<PaymentObligation[]> {
    const { playerIds } = options
    
    const { data } = await api.get('/api/payments/obligations', {
    params: { 
      playerIds, 
    },
  });
    return data;
  },

  async updateObligation(id: number, obligation: PaymentObligation): Promise<PaymentObligation> {
    console.log(`obligation info: ${JSON.stringify(obligation)}`);
    const {data}  = await api.patch(`/api/payments/obligations/${id}`, { obligation });
    console.log(`received Data: ${JSON.stringify(data)}`);
    return data;
  },

  // ============================================================
  // INTENTIONS DE PAIEMENT
  // ============================================================

  async createIntent(dto: PaymentIntent): Promise<PaymentIntent> {
    const { data } = await api.post('/api/payments/intents', dto);
    return data;
  },

  async getMyIntents(): Promise<PaymentIntent[]> {
    const { data } = await api.get('/api/payments/intents');
    return data;
  },

  async getIntentById(id: number): Promise<PaymentIntent> {
    const { data } = await api.get(`/api/payments/intents/${id}`);
    return data;
  },

  async getIntentByReference(ref: string): Promise<PaymentIntent> {
    const { data } = await api.get(`/api/payments/intents/reference/${ref}`);
    return data;
  },

  // ============================================================
  // VÉRIFICATION (admin)
  // ============================================================

  async verifyPayment(dto: VerifyPaymentDto): Promise<{ message: string; intent: PaymentIntent }> {
    const { data } = await api.patch('/api/payments/verify', dto);
    return data;
  },

  // ============================================================
  // RÉSUMÉ
  // ============================================================

  async getMySummary(): Promise<PaymentSummary> {
    const { data } = await api.get('/api/payments/summary');
    return data;
  },

  async getUserSummary(userId: number): Promise<PaymentSummary> {
    const { data } = await api.get(`/api/payments/admin/summary/${userId}`);
    return data;
  },

  // ============================================================
  // ADMIN : VUE GLOBALE
  // ============================================================

  async getAllObligations(): Promise<PaymentObligation[]> {
    const { data } = await api.get('/api/payments/admin/obligations');
    return data;
  },

  async getAllIntents(): Promise<PaymentIntent[]> {
    const { data } = await api.get('/api/payments/admin/intents');
    return data;
  },

  async getAllEvents(includeInactive = false): Promise<PaymentEvent[]> {
  const { data } = await api.get(`/api/payments/admin/events?includeInactive=${includeInactive}`);
  return data;
},

  async createEvent(data: CreatePaymentEventDto): Promise<PaymentEvent> {
    const { data: event } = await api.post('/api/payments/admin/events', data);
    return event;
  },

  async updateEvent(id: number, data: UpdatePaymentEventDto): Promise<PaymentEvent> {
    const { data: event } = await api.patch(`/api/payments/admin/events/${id}`, data);
    return event;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/api/payments/admin/events/${id}`);
  },

};