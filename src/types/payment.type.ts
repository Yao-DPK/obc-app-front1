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

export interface CreatePaymentEventDto {
  name: string;
  description?: string;
  amount: number;
  allowInstallments?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdatePaymentEventDto extends Partial<CreatePaymentEventDto> {
  isActive?: boolean;
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


export interface CreatePaymentObligationDto {
  playerId?: number | null;
  amount: number;
  dueDate: string;
  description: string;
  status?: PaymentObligationStatus;
}

export interface UpdatePaymentObligationDto extends Partial<CreatePaymentObligationDto> {}



export interface PaymentObligation {
  id?: number;
  userId?: number;
  name?: string
  eventId?: number;
  playerId?: number;
  totalAmount?: number;
  paidAmount?: number;
  remainingAmount?: number;
  dueDate?: string | null;
  description?: string;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}

export interface PaymentIntent {
  id?: number;
  obligationId: number;
  userId: number;
  amount: number;
  method: 'momo' | 'card';
  transactionReference: string | null;
  transactionMetadata?: { 
    phone?: string;
    cart_id?: string;
    custom_field?: string} | null;
  status: 'pending' | 'paid' | 'failed' | 'expired' | 'cancelled';
  declaredAt?: string;
  verifiedBy?: number | null;
  verifiedAt?: string | null;
  createdAt?: string;
}



export interface PaymentEvent {
  id: number;
  name: string;
  description: string | null;
  amount: number;
  allowInstallments: boolean;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  totalObligations: number;
  totalAmount: number;
  totalPaid: number;
  totalRemaining: number;
  statusCounts: {
    pending: number;
    partial: number;
    paid: number;
    overdue: number;
  };
}

export interface CreateObligationDto {
  eventId: number;
  playerIds: number[];
  totalAmount: number;
  dueDate?: string;
}


export interface VerifyPaymentDto {
  intentId: number;
  status: 'verified' | 'rejected';
}

