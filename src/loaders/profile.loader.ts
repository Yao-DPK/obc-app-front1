// ========== loaders/profile.loader.ts ==========
import type { LoaderFunction } from 'react-router-dom';

import { userService } from '@/lib/services/user.service';

export const profileLoader: LoaderFunction = async () => {
  try {
    const data = await userService.fetchProfile();
    return data;
  } catch (error) {
    throw new Response('Profil non trouvé', { status: 404 });
  }
};