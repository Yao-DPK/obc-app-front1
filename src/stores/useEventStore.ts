import { create } from 'zustand';
import { eventService } from '@/lib/services/event.service';
import type { Event, DocumentType, PaymentEvent, CreateEventDto, UpdateEventDto } from '@/types';

interface EventStore {
  // État
  events: Event[];
  currentEvent: Event | null;
  documentTypes: DocumentType[];
  paymentEvents: PaymentEvent[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchEvents: (params?: { isActive?: boolean; search?: string }) => Promise<void>;
  fetchEvent: (id: number) => Promise<void>;
  createEvent: (data: CreateEventDto) => Promise<Event>;
  updateEvent: (id: number, data: UpdateEventDto) => Promise<Event>;
  deleteEvent: (id: number) => Promise<void>;
  fetchDocumentTypes: () => Promise<void>;
  fetchPaymentEvents: () => Promise<void>;
  clear: () => void;
}

export const useEventStore = create<EventStore>((set/* , get */) => ({
  events: [],
  currentEvent: null,
  documentTypes: [],
  paymentEvents: [],
  isLoading: false,
  error: null,

  fetchEvents: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const events = await eventService.getEvents(params);
      set({ events, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const event = await eventService.getEvent(id);
      set({ currentEvent: event, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createEvent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const event = await eventService.createEvent(data);
      set((state) => ({
        events: [event, ...state.events],
        isLoading: false,
      }));
      return event;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateEvent: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await eventService.updateEvent(id, data);
      set((state) => ({
        events: state.events.map((e) => (e.id === id ? updated : e)),
        currentEvent: updated,
        isLoading: false,
      }));
      return updated;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await eventService.deleteEvent(id);
      set((state) => ({
        events: state.events.filter((e) => e.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  fetchDocumentTypes: async () => {
    set({ isLoading: true, error: null });
    try {
      const types = await eventService.getDocumentTypes();
      set({ documentTypes: types, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPaymentEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const paymentEvents = await eventService.getPaymentEvents();
      set({ paymentEvents, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clear: () => {
    set({
      events: [],
      currentEvent: null,
      documentTypes: [],
      paymentEvents: [],
      isLoading: false,
      error: null,
    });
  },
}));