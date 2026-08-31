import { create } from 'zustand';
import axios from 'src/lib/axios';
import type { User } from '@/types';
import { userService } from '@/lib/services/user.service';

interface AuthStore {
  user: User | null;
  userProfilePicture: string | null;
  accessToken: string | null;
  isLoading: boolean;
  fetchProfilePicture: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set, get) => ({
  user: null,
  accessToken: null,
  isLoading: true,
  userProfilePicture: null, 

  setAuth: (user, accessToken) => {
    set({ user, accessToken });
  },

  fetchProfilePicture: async () => {
        set({ isLoading: true });
        try {
          const { signedUrl } = await userService.fetchUserPicture(get().user?.id!);
          set({ userProfilePicture: signedUrl });
        } catch {
          set({ userProfilePicture: null });
        } finally {
          set({ isLoading: true });
        }
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
      const { accessToken } = res.data;

      if (accessToken) {
        // ✅ Charger le profil complet (optionnel si user est déjà complet)
        const profile = await axios.get('/api/users/me', {
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