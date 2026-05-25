// apps/web/src/stores/usePaymentStore.ts
import { create } from 'zustand';
import { mockPayments } from '@/lib/mock-data/mock-data';
import type { Payment } from '@/types/payment.type';


interface PaymentStore {
  payments: Payment[];
  isLoading: boolean;
  fetchPayments: (userId?: number) => Promise<void>;
}

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  isLoading: false,
  fetchPayments: async (userId) => {
    set({ isLoading: true });
    try {
      // TODO: Remplacer par appel API
      // const response = await api.get('/payments', { params: { userId } });
      await new Promise(resolve => setTimeout(resolve, 500));
      let payments = [...mockPayments];
      if (userId) payments = payments.filter(p => p.userId === userId);
      set({ payments, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));