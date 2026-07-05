// ========== loaders/pupilsList.loader.ts ==========
import type { LoaderFunction } from 'react-router-dom';
import api from '@/lib/axios';
import type { User } from '@/types';

export const pupilsListLoader: LoaderFunction = async () => {
  try {
    const { data } = await api.get<User[]>('/api/parent/children');

    return data;
  } catch (error) {
    throw new Response('Liste des enfants non disponible', { status: 404 });
  }
};