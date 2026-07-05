import { create } from 'zustand';
import { guardianService } from '@/lib/services/guardian.service';
import type { User, GuardianRelationship } from '@/types';

interface GuardianStore {
  // ========== ÉTAT ==========
  players: User[]; // liste des enfants (objets User complets)
  guardians: User[]; // liste des parents (objets User complets)
  selected_player: User | null;
  relationships: GuardianRelationship[];
  isLoading: boolean;
  error: string | null;

  // ========== ACTIONS ==========
  getMyPlayers: () => Promise<User[]>;
  //getMyGuardians: () => Promise<User[]>;
  
  getPlayersByGuardian: (guardianId: number) => Promise<User[]>;
  getGuardiansByPlayer: (playerId: number) => Promise<User[]>;
  linkPlayer: (guardianId: number, playerId: number, permissions?: any) => Promise<void>;
  unlinkPlayer: (guardianId: number, playerId: number) => Promise<void>;
  updatePermissions: (guardianId: number, playerId: number, permissions: any) => Promise<void>;
  clear: () => void;
}

export const useGuardianStore = create<GuardianStore>((set, get) => ({
  // ========== ÉTAT INITIAL ==========
  players: [],
  guardians: [],
  selected_player: null,
  relationships: [],
  isLoading: false,
  error: null,

  // ========== RÉCUPÉRATION ==========

  getPlayersByGuardian: async (guardianId: number) => {
    set({ isLoading: true, error: null });
    try {
      // Option 1 : si le backend retourne les IDs, on les convertit en Users
      const players = await guardianService.getPlayers(guardianId);
      
      set({ players, isLoading: false });
      return players;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  getMyPlayers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Option 1 : si le backend retourne les IDs, on les convertit en Users
      const players = await guardianService.getMyPlayers();
      set({ players, isLoading: false });
      return players;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  /* getMyGuardians: async () => {
    set({ isLoading: true, error: null });
    try {
      // Option 1 : si le backend retourne les IDs, on les convertit en Users
      const playerIds = await guardianService.getMyGuardians();
  
      
      set({ players, isLoading: false });
      return players;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  }, */

  getGuardiansByPlayer: async (playerId: number) => {
    set({ isLoading: true, error: null });
    try {
      const guardians = await guardianService.getGuardians(playerId);
      set({ guardians, isLoading: false });
      return guardians;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  // ========== MUTATIONS ==========

  linkPlayer: async (guardianId: number, playerId: number, permissions?: any) => {
    set({ isLoading: true, error: null });
    try {
      await guardianService.linkPlayer(guardianId, playerId, permissions);
      
      // Rafraîchir la liste des enfants
      await get().getPlayersByGuardian(guardianId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  unlinkPlayer: async (guardianId: number, playerId: number) => {
    set({ isLoading: true, error: null });
    try {
      await guardianService.unlinkPlayer(guardianId, playerId);
      
      // Rafraîchir la liste des enfants
      await get().getPlayersByGuardian(guardianId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updatePermissions: async (guardianId: number, playerId: number, permissions: any) => {
    set({ isLoading: true, error: null });
    try {
      await guardianService.updatePermissions(guardianId, playerId, permissions);
      
      // Rafraîchir la liste des enfants
      await get().getPlayersByGuardian(guardianId);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // ========== UTILITAIRES ==========

  clear: () => {
    set({
      players: [],
      guardians: [],
      relationships: [],
      isLoading: false,
      error: null,
    });
  },
}));