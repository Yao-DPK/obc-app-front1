import type { LoaderFunction } from 'react-router-dom';
import { documentService } from '@/lib/services/document.service';

export const childDocumentsLoader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  
  if (!id) {
    throw new Response('ID manquant', { status: 400 });
  }

  try {
    const  data  = await documentService.getDocuments({userId: Number(id)});
    return data;
  } catch (error) {
    throw new Response('Documents non trouvés', { status: 404 });
  }
};