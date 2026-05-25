// apps/web/src/stores/useGuardianStore.ts
import { create } from 'zustand';
import { mockGuardianRelationships } from '@/lib/mock-data/mock-data';
import type { GuardianRelationship } from '@/types';

interface GuardianStore {
  relationships: GuardianRelationship[];
  isLoading: boolean;
  fetchGuardianRelationships: () => Promise<void>;
  getPlayersByGuardian: (guardianId: number) => GuardianRelationship[];
  getGuardiansByPlayer: (playerId: number) => GuardianRelationship[];
}

export const useGuardianStore = create<GuardianStore>((set, get) => ({
  relationships: [],
  isLoading: false,
  fetchGuardianRelationships: async () => {
    set({ isLoading: true });
    try {
      // TODO: Remplacer par appel API
      // const response = await api.get('/guardian-relationships');
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ relationships: mockGuardianRelationships, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  getPlayersByGuardian: (guardianId) => get().relationships.filter(r => r.guardianId === guardianId),
  getGuardiansByPlayer: (playerId) => get().relationships.filter(r => r.playerId === playerId),
}));