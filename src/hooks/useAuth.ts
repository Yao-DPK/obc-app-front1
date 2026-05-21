import { create } from 'zustand';
import api from 'src/lib/axios';

interface User {
  id: number;
  email: string;
  role: string;
  phone?: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: (accessToken) => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null }),
  restoreSession: async () => {
    set({ isLoading: true });
    try {
      // Utilisation de l'instance api avec withCredentials: true
      const res = await api.post('/auth/refresh', {});
      const { accessToken, user } = res.data;
      if (accessToken) {
        set({ user, accessToken, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));