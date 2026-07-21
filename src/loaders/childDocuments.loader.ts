// ========== loaders/childDocuments.loader.ts ==========
import type { LoaderFunction } from 'react-router-dom';
import api from '@/lib/axios';
import type { Document } from '@/types';

export const childDocumentsLoader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  
  if (!id) {
    throw new Response('ID manquant', { status: 400 });
  }

  try {
    const { data } = await api.get<Document[]>(`/api/children/${id}/documents`);
    return data;
  } catch (error) {
    throw new Response('Documents non trouvés', { status: 404 });
  }
};