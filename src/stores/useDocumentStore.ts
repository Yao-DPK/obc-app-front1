// apps/web/src/stores/useDocumentStore.ts
import { create } from 'zustand';
import { mockDocuments } from '@/lib/mock-data/mock-data';
import type { Document } from '@/types/document.type'

interface DocumentStore {
  documents: Document[];
  isLoading: boolean;
  fetchDocuments: (userId?: number) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  isLoading: false,
  fetchDocuments: async (userId) => {
    set({ isLoading: true });
    try {
      // TODO: Remplacer par appel API
      // const response = await api.get('/documents', { params: { userId } });
      await new Promise(resolve => setTimeout(resolve, 500));
      let docs = [...mockDocuments];
      if (userId) docs = docs.filter(d => d.userId === userId);
      set({ documents: docs, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
}));