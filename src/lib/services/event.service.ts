// src/lib/services/event.service.ts
import api from '@/lib/axios';
import type { Event, CreateEventDto, UpdateEventDto, DocumentType, PaymentEvent } from '@/types';

export const eventService = {
  // ========== CRUD ==========
  async getEvents(params?: { isActive?: boolean; search?: string }): Promise<Event[]> {
    const { data } = await api.get('/api/events', { params });
    return data;
  },

  async getActiveEvents(): Promise<Event[]> {
    const { data } = await api.get('/api/events/active');
    return data;
  },

  async getEvent(id: number): Promise<Event> {
    const { data } = await api.get(`/api/events/${id}`);
    return data;
  },

  async createEvent(dto: CreateEventDto): Promise<Event> {
    const { data } = await api.post('/api/events', dto);
    return data;
  },

  async updateEvent(id: number, dto: UpdateEventDto): Promise<Event> {
    const { data } = await api.patch(`/api/events/${id}`, dto);
    return data;
  },

  async deleteEvent(id: number): Promise<void> {
    await api.delete(`/api/events/${id}`);
  },

  // ========== ASSOCIATIONS ==========
  // Récupérer les documents disponibles
  async getDocumentTypes(): Promise<DocumentType[]> {
    const { data } = await api.get('/api/documents/types');
    return data;
  },

  // Récupérer les paiements disponibles
  async getPaymentEvents(): Promise<PaymentEvent[]> {
    const { data } = await api.get('/api/payments/events');
    return data;
  },
};