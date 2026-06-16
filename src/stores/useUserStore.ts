// apps/web/src/stores/useUserStore.ts
import { create } from 'zustand';
import type { User } from '@/types/user.type';
import api from '@/lib/axios';


interface UserStore {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  fetchPlayers: () => Promise<void>;
  getUserById: (id: number) => User | undefined;
  updateUserStatus: (userId: number, status: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      // TODO: Remplacer par appel API
      const response = await api.get('/api/users');
      set({ users: response.data, isLoading: false });
      //await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
      //set({ users: mockUsers, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  fetchPlayers: async () => {
    set({ isLoading: true });
    try {
      // TODO: Remplacer par appel API
      const response = await api.get('/api/users/players');
      console.log(`Received Players: ${response.data}`)
      set({ users: response.data, isLoading: false });
      //await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
      //set({ users: mockUsers, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  getUserById: (id) => get().users.find(u => u.id === id),
  updateUserStatus: async (userId: number, status: string) => {
    await api.patch(`/api/users/${userId}/status`, { status });
    await get().fetchUsers();
  }
}));