// apps/web/src/stores/useDocumentStore.ts
import { create } from 'zustand';
import type { Document, DocumentStatus } from '@/types/document.type'
import api from '@/lib/axios';

interface DocumentStore {
  documents: Document[];
  pendingDocuments: number;
  isLoading: boolean;
  fetchDocuments: (userId?: number) => Promise<void>;
  fetchPendingDocuments: (userId?: number) => Promise<void>;
  fetchUserDocuments: (userId: number) => Promise<void>;
  validateDocument: (documentId: number, validated: boolean, adminId?: number) => Promise<void>;
  updateDocumentStatus: (documentId: number, status: DocumentStatus, adminId?: number) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  isLoading: false,
  pendingDocuments: 0,
  fetchDocuments: async () => {
    set({ isLoading: true });
    try {
      // TODO: Remplacer par appel API
      const response = await api.get(`/api/documents/`);
      let received_docs = response.data;
      set({ documents: received_docs, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  fetchUserDocuments: async (userId: number) => {
    set({ isLoading: true });
    try {
      // TODO: Remplacer par appel API
      const response = await api.get(`/api/documents/user/${userId}`);
      let received_docs = response.data;
      set({ documents: received_docs, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  fetchPendingDocuments: async() => {
    set({isLoading: true});
    try {
      const response = await api.get(`/api/documents/pending`);
      let received_length = response.data;
      console.log('received_length: ', received_length)
      set({ pendingDocuments: received_length})
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },

  updateDocumentStatus: async (documentId: number, status: DocumentStatus, adminId?: number) => {
  await api.patch(`/api/documents/${documentId}/status`, { status, adminId });
  // puis rafraîchissez la liste des documents (fetchUserDocuments)
},

  validateDocument: async (documentId: number, validated: boolean, adminId?: number) => {
  const status = validated ? 'Validé' : 'Rejeté';
  await api.put(`/api/documents/${documentId}/validate`, { status, adminId });
  // puis rafraîchir la liste des documents
}
}));