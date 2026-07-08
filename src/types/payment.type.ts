// packages/shared/src/types/payment.types.ts

export type PaymentMethod = 'momo' | 'card' | 'cash';
export type PaymentStatus = 'pending' | 'verified' | 'rejected';
export type PaymentObligationStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';


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


export interface CreatePaymentEventDto {
  name: string;
  description: string;
  amount: number;
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export type UpdatePaymentEventDto = Partial<CreatePaymentEventDto>;

export interface CreateIntentPayload {
  eventId: number;
  paymentMethod: 'momo' | 'card';
  playerIds?: number[];
}

export interface IntentResponse {
  intentId: number;
  amountToPay: number;
  feesAmount: number;
  totalAmount: number;
  publicKey: string;
}

export interface IntentStatus {
  status: 'pending' | 'paid' | 'failed' | 'expired';
}

export interface IntentStatusResponse {
  status: string;
}

export interface PaymentObligation {
  id: number;
  playerId: number | null;
  amount: number;
  amount_paid: number;
  dueDate: string; // YYYY-MM-DD
  description: string;
  status: PaymentObligationStatus;
  createdAt: string;
}
/* {
    amount: number;
    description: string;
    status: "pending" | "paid" | "overdue" | "cancelled" | "ongoing";
    playerId?: number | null | undefined;
    amount_paid?: number | null | undefined;
    dueDate?: string | null | undefined;
} */


export interface CreatePaymentObligationDto {
  playerId?: number | null;
  amount: number;
  dueDate: string;
  description: string;
  status?: PaymentObligationStatus;
}

export interface UpdatePaymentObligationDto extends Partial<CreatePaymentObligationDto> {}

// Payment Intent (Kadev Pay)
export interface CreateIntentDto {
  amount: number;
  description: string;
  playerId?: number;
}




