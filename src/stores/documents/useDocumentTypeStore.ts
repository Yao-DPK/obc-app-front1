import { create } from 'zustand';
import { documentService } from '@/lib/services/document.service';
import type { DocumentType, CreateDocumentTypeDto, UpdateDocumentTypeDto } from '@/types';

interface DocumentTypeStore {
  docTypes: DocumentType[];
  isLoading: boolean;
  error: string | null;

  fetchDocTypes: ({id, name, names, includeInactive}: {id?: string, name?: string, names?: string[], includeInactive?: boolean}) => Promise<void>;
  createDocType: (data: CreateDocumentTypeDto) => Promise<DocumentType>;
  updateDocType: (id: number, data: UpdateDocumentTypeDto) => Promise<DocumentType>;
  deleteDocType: (id: number) => Promise<void>;
  toggleActive: (id: number) => Promise<void>;
  clear: () => void;
}

export const useDocumentTypeStore = create<DocumentTypeStore>((set, get) => ({
  docTypes: [],
  isLoading: false,
  error: null,

  fetchDocTypes: async ({id, name, names, includeInactive}: {id?: string, name?: string, names?: string[], includeInactive?: boolean}) => {
    set({ isLoading: true, error: null });
    try {
      const docTypes = await documentService.getDocumentTypes({id, name, names, includeInactive});
      set({ docTypes: docTypes, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  createDocType: async (data: CreateDocumentTypeDto) => {
    set({ isLoading: true, error: null });
    try {
      const docType = await documentService.createDocumentType(data);
      set((state) => ({
        docTypes: [...state.docTypes, docType],
        isLoading: false,
      }));
      return docType;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateDocType: async (id: number, data: UpdateDocumentTypeDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await documentService.updateDocumentType(id, data);
      set((state) => ({
        docTypes: state.docTypes.map((d) => (d.id === id ? updated : d)),
        isLoading: false,
      }));
      return updated;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteDocType: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await documentService.deleteDocumentType(id);
      set((state) => ({
        docTypes: state.docTypes.filter((d) => d.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  toggleActive: async (id: number) => {
    const docType = get().docTypes.find((d) => d.id === id);
    if (!docType) return;
    await get().updateDocType(id, { isActive: !docType.isActive });
  },

  clear: () => {
    set({ docTypes: [], isLoading: false, error: null });
  },
}));