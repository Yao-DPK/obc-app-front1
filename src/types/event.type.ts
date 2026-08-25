export interface Event {
  id: number;
  name: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  documentTypeIds: number[];
  paymentEventIds: number[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  documentTypeIds?: number[];
  paymentEventIds?: number[];
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}