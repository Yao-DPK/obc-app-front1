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