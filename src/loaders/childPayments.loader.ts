// ========== loaders/childPayments.loader.ts ==========
import type { LoaderFunction } from 'react-router-dom';
import api from '@/lib/axios';
import type { Payment } from '@/types';

export const childPaymentsLoader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  
  if (!id) {
    throw new Response('ID manquant', { status: 400 });
  }

  try {
    const { data } = await api.get<Payment[]>(`/api/children/${id}/payments`);
    return data;
  } catch (error) {
    throw new Response('Paiements non trouvés', { status: 404 });
  }
};