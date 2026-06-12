// packages/shared/src/types/payment.types.ts

export type PaymentMethod = 'wave' | 'orange_money' | 'cash';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';

export interface Payment {
  id: number;
  userId: number;
  amount: number;       // decimal in DB becomes number in JS
  method: PaymentMethod;
  transactionReference?: string | null;
  reason: string;
  playerIds: number[];  // liste des IDs joueurs concernés
  status: PaymentStatus;
  declaredAt: string;   // ISO datetime
  verifiedBy?: number | null;
  verifiedAt?: string | null;
}

export interface PaymentEvent {
  id: number;
  name: string;
  description: string;
  amount: string;       // montant hors frais
  allowInstallments: boolean;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface CreateIntentPayload {
  eventId: number;
  paymentMethod: 'momo' | 'card';
  playerIds?: number[];
}

export interface IntentResponse {
  intentId: number;
  amountToPay: string;
  feesAmount: string;
  totalAmount: string;
  publicKey: string;
}

export interface IntentStatus {
  status: 'pending' | 'paid' | 'failed' | 'expired';
}