// apps/web/src/stores/useUserStore.ts
import { create } from 'zustand';
import type { User } from '@/types/user.type';
import { mockUsers } from '@/lib/mock-data/mock-data';


interface UserStore {
  users: User[];
  isLoading: boolean;
  fetchUsers: () => Promise<void>;
  getUserById: (id: number) => User | undefined;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      // TODO: Remplacer par appel API
      // const response = await api.get('/users');
      // set({ users: response.data, isLoading: false });
      await new Promise(resolve => setTimeout(resolve, 500)); // simulate delay
      set({ users: mockUsers, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  getUserById: (id) => get().users.find(u => u.id === id),
}));