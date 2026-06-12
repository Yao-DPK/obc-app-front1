import type { CreateIntentPayload, IntentResponse, IntentStatus, PaymentEvent } from "@/types";
import api from "../axios";

export const paymentService = {
  async getActiveEvents(): Promise<PaymentEvent[]> {
    const { data } = await api.get('/payment-events');
    return data;
  },

  async createIntent(payload: CreateIntentPayload): Promise<IntentResponse> {
    const { data } = await api.post('/payment-intents', payload);
    return data;
  },

  async getIntentStatus(intentId: number): Promise<IntentStatus> {
    const { data } = await api.get(`/payment-intents/${intentId}/status`);
    return data;
  },
};