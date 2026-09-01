// src/stores/usePaymentIntentStore.ts
import { create } from 'zustand';
import { paymentIntentService, type IntentFilters } from '@/lib/services/paymentIntent.service';
import type { PaymentIntent } from '@/types';

interface PaymentIntentStore {
  intents: PaymentIntent[];
  isLoading: boolean;
  error: string | null;

  fetchIntents: (filters?: IntentFilters) => Promise<void>;
  verifyIntent: (id: number, status: 'paid' | 'failed', rejectionReason?: string) => Promise<void>;
  clear: () => void;
}

export const usePaymentIntentStore = create<PaymentIntentStore>((set) => ({
  intents: [],
  isLoading: false,
  error: null,


  fetchIntents: async (filters?: IntentFilters) => {
    set({ isLoading: true, error: null });
    try {
      const intents = await paymentIntentService.fetchIntents(filters);
      set({ intents, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  verifyIntent: async (id: number, status: 'paid' | 'failed', rejectionReason?: string) => {
    set({ isLoading: true, error: null });
    try {
      await paymentIntentService.verify(id, status, rejectionReason);
      // Recharger la liste en cours (si on est sur une obligation spécifique, on la recharge)
      // Ici on suppose que le composant parent gère le rafraîchissement.
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  clear: () => {
    set({ intents: [], isLoading: false, error: null });
  },
}));