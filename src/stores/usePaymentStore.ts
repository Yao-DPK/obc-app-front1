// apps/web/src/stores/usePaymentStore.ts
import { create } from 'zustand';
import api from '@/lib/axios';
import type { Payment, PaymentObligation, PaymentObligationStatus } from '@/types/payment.type';
import { paymentService } from '@/lib/services/payment.service';

interface PaymentStore {
  payments: Payment[];
  obligations: PaymentObligation[];
  isLoadingPayments: boolean;
  isLoadingObligations: boolean;
  fetchPayments: (userId?: number) => Promise<void>;
  fetchObligations: (playerId: number) => Promise<void>;
  updateObligationStatus: (id: number, status: PaymentObligationStatus) => Promise<void>;
}

export const usePaymentStore = create<PaymentStore>((set, get) => ({
  payments: [],
  obligations: [],
  isLoadingPayments: false,
  isLoadingObligations: false,

  fetchPayments: async (userId) => {
    set({ isLoadingPayments: true });
    try {
      // Appel API réel
      const params = userId ? { userId } : {};
      const response = await api.get('/payments', { params });
      set({ payments: response.data, isLoadingPayments: false });
    } catch (error) {
      console.error('Erreur lors du chargement des paiements', error);
      set({ isLoadingPayments: false });
    }
  },

  fetchObligations: async (playerId) => {
    set({ isLoadingObligations: true });
    try {
      const data = await paymentService.getObligationsByPlayer(playerId);
      set({ obligations: data, isLoadingObligations: false });
    } catch (error) {
      console.error('Erreur lors du chargement des obligations', error);
      set({ isLoadingObligations: false });
    }
  },

  updateObligationStatus: async (id, status) => {
    try {
      const data = await paymentService.updateObligationStatus(id, status);
      // Mettre à jour l'obligation dans le store
      set((state) => ({
        obligations: state.obligations.map((ob) =>
          ob.id === id ? { ...ob, status: data.status } : ob
        ),
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut', error);
      throw error;
    }
  },
}));