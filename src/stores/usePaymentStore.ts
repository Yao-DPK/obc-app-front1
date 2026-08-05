// src/stores/usePaymentStore.ts
import { create } from 'zustand';
import { paymentService } from '@/lib/services/payment.service';
import type {
  PaymentObligation,
  PaymentIntent,
  PaymentSummary,
  VerifyPaymentDto,
  CreateObligationDto,
  PaymentEvent,
  CreatePaymentEventDto,
  UpdatePaymentEventDto,
} from '@/types';

interface PaymentStore {
  // ========== ÉTATS ==========
  obligations: PaymentObligation[];
  intents: PaymentIntent[];
  allObligations: PaymentObligation[]; // pour l'admin
  allIntents: PaymentIntent[]; // pour l'admin
  allEvents: PaymentEvent[]; // pour l'admin
  isLoadingEvents: boolean;
  summary: PaymentSummary | null;
  isLoadingObligations: boolean;
  isLoadingIntents: boolean;
  isLoadingSummary: boolean;
  isLoading: boolean;
  error: string | null;

  // ========== ACTIONS ==========
  fetchObligations: (params?: { playerId?: number }) => Promise<void>;
  fetchIntents: () => Promise<void>;
  fetchAllObligations: () => Promise<PaymentObligation[]>;
  fetchAllIntents: () => Promise<PaymentIntent[]>;
  fetchSummary: () => Promise<void>;
  fetchUserSummary: (userId: number) => Promise<void>;
  createObligation: (dto: CreateObligationDto) => Promise<PaymentObligation>;
  updateObligation: (id: number, data: PaymentObligation) => Promise<PaymentObligation>;
  createIntent: (dto: PaymentIntent) => Promise<PaymentIntent>;
  cancelObligation: (id: number) => Promise<void>;
  verifyPayment: (dto: VerifyPaymentDto) => Promise<void>;
  fetchAllEvents: (includeInactive?: boolean) => Promise<void>;
  createEvent: (data: CreatePaymentEventDto) => Promise<PaymentEvent>;
  updateEvent: (id: number, data: UpdatePaymentEventDto) => Promise<PaymentEvent>;
  deleteEvent: (id: number) => Promise<void>;
  clear: () => void;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  // ========== ÉTATS INITIAUX ==========
  obligations: [],
  intents: [],
  allObligations: [],
  allIntents: [],
  allEvents: [],
  isLoadingEvents: false,
  summary: null,
  isLoadingObligations: false,
  isLoadingIntents: false,
  isLoadingSummary: false,
  isLoading: false,
  error: null,

  // ========== RÉCUPÉRATION (utilisateur connecté) ==========

  fetchObligations: async (params) => {
    set({ isLoadingObligations: true, error: null });
    try {
      const obligations = await paymentService.getObligations(params);
      set({ obligations, isLoadingObligations: false });
    } catch (error: any) {
      set({ error: error.message, isLoadingObligations: false });
    }
  },

  fetchIntents: async () => {
    set({ isLoadingIntents: true, error: null });
    try {
      const intents = await paymentService.getMyIntents();
      set({ intents, isLoadingIntents: false });
    } catch (error: any) {
      set({ error: error.message, isLoadingIntents: false });
    }
  },

  fetchSummary: async () => {
    set({ isLoadingSummary: true, error: null });
    try {
      const summary = await paymentService.getMySummary();
      set({ summary, isLoadingSummary: false });
    } catch (error: any) {
      set({ error: error.message, isLoadingSummary: false });
    }
  },

  fetchUserSummary: async (userId: number) => {
    set({ isLoadingSummary: true, error: null });
    try {
      const summary = await paymentService.getUserSummary(userId);
      set({ summary, isLoadingSummary: false });
    } catch (error: any) {
      set({ error: error.message, isLoadingSummary: false });
    }
  },

  // ========== RÉCUPÉRATION (admin – toutes les données) ==========

  fetchAllObligations: async () => {
    set({ isLoadingObligations: true, error: null });
    try {
      const obligations = await paymentService.getAllObligations();
      set({ allObligations: obligations, isLoadingObligations: false });
      return obligations;
    } catch (error: any) {
      set({ error: error.message, isLoadingObligations: false });
      return [];
    }
  },

  fetchAllIntents: async () => {
    set({ isLoadingIntents: true, error: null });
    try {
      const intents = await paymentService.getAllIntents();
      set({ allIntents: intents, isLoadingIntents: false });
      return intents;
    } catch (error: any) {
      set({ error: error.message, isLoadingIntents: false });
      return [];
    }
  },

  // ========== MUTATIONS ==========

  createObligation: async (dto: CreateObligationDto) => {
    set({ isLoadingObligations: true, error: null });
    try {
      const obligation = await paymentService.createObligation(dto);
      set((state) => ({
        obligations: [...state.obligations, obligation],
        allObligations: [...state.allObligations, obligation],
        isLoadingObligations: false,
      }));
      return obligation;
    } catch (error: any) {
      set({ error: error.message, isLoadingObligations: false });
      throw error;
    }
  },

  createIntent: async (dto: PaymentIntent) => {
    set({ isLoadingIntents: true, error: null });
    try {
      const intent = await paymentService.createIntent(dto);
      set((state) => ({
        intents: [...state.intents, intent],
        allIntents: [...state.allIntents, intent],
        isLoadingIntents: false,
      }));
      return intent;
    } catch (error: any) {
      set({ error: error.message, isLoadingIntents: false });
      throw error;
    }
  },

  updateObligation: async (id: number, data: PaymentObligation) => {
  set({ isLoadingObligations: true, error: null });
  try {
    const updated = await paymentService.updateObligation(id, data);
    set((state) => ({
      obligations: state.obligations.map((o) => (o.id === id ? updated : o)),
      isLoadingObligations: false,
    }));
    return updated;
  } catch (error: any) {
    set({ error: error.message, isLoadingObligations: false });
    throw error;
  }
},

  cancelObligation: async (id: number) => {
    set({ isLoadingObligations: true, error: null });
    try {
      const updated = await paymentService.cancelObligation(id);
      set((state) => ({
        obligations: state.obligations.map((o) => (o.id === id ? updated : o)),
        allObligations: state.allObligations.map((o) => (o.id === id ? updated : o)),
        isLoadingObligations: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoadingObligations: false });
      throw error;
    }
  },

  verifyPayment: async (dto: VerifyPaymentDto) => {
    set({ isLoadingIntents: true, error: null });
    try {
      await paymentService.verifyPayment(dto);
      // Rafraîchir les données après vérification
      await get().fetchIntents();
      await get().fetchSummary();
      // Optionnel : rafraîchir aussi les allIntents si on est en mode admin
      // await get().fetchAllIntents();
    } catch (error: any) {
      set({ error: error.message, isLoadingIntents: false });
      throw error;
    } finally {
      set({ isLoadingIntents: false });
    }
  },

  // ========== EVENTS  ==========
fetchAllEvents: async (includeInactive = false) => {
  set({ isLoadingEvents: true, error: null });
  try {
    const events = await paymentService.getAllEvents(includeInactive);
    set({ allEvents: events, isLoadingEvents: false });
  } catch (error: any) {
    set({ error: error.message, isLoadingEvents: false });
  }
},

createEvent: async (data: CreatePaymentEventDto) => {
  set({ isLoadingEvents: true, error: null });
  try {
    const event = await paymentService.createEvent(data);
    set((state) => ({
      allEvents: [...state.allEvents, event],
      isLoadingEvents: false,
    }));
    return event;
  } catch (error: any) {
    set({ error: error.message, isLoadingEvents: false });
    throw error;
  }
},

updateEvent: async (id: number, data: UpdatePaymentEventDto) => {
  set({ isLoadingEvents: true, error: null });
  try {
    const updated = await paymentService.updateEvent(id, data);
    set((state) => ({
      allEvents: state.allEvents.map((e) => (e.id === id ? updated : e)),
      isLoadingEvents: false,
    }));
    return updated;
  } catch (error: any) {
    set({ error: error.message, isLoadingEvents: false });
    throw error;
  }
},

deleteEvent: async (id: number) => {
  set({ isLoadingEvents: true, error: null });
  try {
    await paymentService.deleteEvent(id);
    set((state) => ({
      allEvents: state.allEvents.filter((e) => e.id !== id),
      isLoadingEvents: false,
    }));
  } catch (error: any) {
    set({ error: error.message, isLoadingEvents: false });
    throw error;
  }
},
  // ========== UTILITAIRES ==========

  clear: () => {
    set({
      obligations: [],
      intents: [],
      allObligations: [],
      allIntents: [],
      summary: null,
      isLoadingObligations: false,
      isLoadingIntents: false,
      isLoadingSummary: false,
      error: null,
    });
  },
}));