import { create } from 'zustand';
import axios from 'src/lib/axios';
import type { User } from '@/types';

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoading: true,

  setAuth: (user, accessToken) => {
    set({ user, accessToken });
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      // Ignorer les erreurs côté réseau
    } finally {
      set({ user: null, accessToken: null });
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
      const { user, accessToken } = res.data;

      if (accessToken) {
        // ✅ Charger le profil complet (optionnel si user est déjà complet)
        const profile = await axios.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        set({ user: profile.data, accessToken, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ user: null, accessToken: null, isLoading: false });
    }
  },
}));