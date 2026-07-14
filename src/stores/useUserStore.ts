import { create } from 'zustand';
import type { User } from '@/types/user.type';
import { userService } from '@/lib/services/user.service';

interface UserStore {
  users: User[];
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // ========== ACTIONS ==========

  fetchUsers: () => Promise<void>;
  fetchUserByIdAndRole: (userId: number, role: string) => Promise<void>
  fetchPlayers: () => Promise<void>;
  fetchAdmins: () => Promise<void>;
  fetchParents: () => Promise<void>;
  fetchUsersByIds: (ids: number[]) => Promise<void>;
  fetchUserById: (id: number) => Promise<User | null>;

  updateUser: (userId: number, data: Partial<User>) => Promise<void>;
  updateStatus: (userId: number, status: string) => Promise<void>;

  clear: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  user: null,
  isLoading: false,
  error: null,

  // ========== RÉCUPÉRATION ==========

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.fetchUsers();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserByIdAndRole: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const user = await userService.fetchUserByRoleAndId(userId, 'player');
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPlayers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.fetchPlayers();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchAdmins: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.fetchAdmins();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchParents: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await userService.fetchParents();
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUsersByIds: async (ids: number[]) => {
    if (!ids.length) {
      set({ users: [], isLoading: false });
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const users = await userService.fetchBatchUsers(ids);
      set({ users, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUserById: async (id: number) => {
    try {
      const user = await userService.fetchUserById(id);
      return user;
    } catch (error: any) {
      set({ error: error.message });
      return null;
    }
  },

  // ========== MISE À JOUR ==========

  updateUser: async (userId: number, data: Partial<User>) => {
    try {
      const updated = await userService.updateUser(userId, data);
      set((state) => ({
        users: state.users.map((u) => (u.id === userId ? updated : u)),
      }));
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  updateStatus: async (userId: number, status: string) => {
    await userService.updateStatus(userId, status);
    await get().fetchUsers(); // Rafraîchir la liste
  },

  // ========== UTILITAIRES ==========

  clear: () => {
    set({ users: [], isLoading: false, error: null });
  },
}));