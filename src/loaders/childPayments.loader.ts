// ========== loaders/childPayments.loader.ts ==========
import type { LoaderFunction } from 'react-router-dom';
import { paymentService } from '@/lib/services/payment.service';
export const childPaymentsLoader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  
  
  if (!id) {
    throw new Response('ID manquant', { status: 400 });
  }

  try {
    const data  = await paymentService.getObligations({playerIds: [Number(id)]});
    return data;
  } catch (error) {
    throw new Response('Paiements non trouvés', { status: 404 });
  }
};