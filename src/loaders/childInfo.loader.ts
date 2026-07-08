// ========== loaders/childInfo.loader.ts ==========
import type { LoaderFunction } from 'react-router-dom';
import { guardianService } from '@/lib/services/guardian.service';

export const childInfoLoader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  
  if (!id) {
    throw new Response('ID manquant', { status: 400 });
  }

  try {
    const  data  = await guardianService.getMyPlayersById(id as unknown as number);
    return data;
  } catch (error) {
    throw new Response('Enfant non trouvé', { status: 404 });
  }
};