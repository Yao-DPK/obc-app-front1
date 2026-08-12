import type { CreateDocumentTypeDto, Document, DocumentType, UpdateDocumentTypeDto } from "@/types";
import api from "../axios";

export interface UploadDocumentPayload{
    files: Document[]
}

export interface GetDocumentTypesOptions {
  id?: string;
  name?: string;
  names?: string[];
  includeInactive?: boolean; // Optionnel, par défaut false
}

export const documentService = {
    async uploadDocuments(payload: FormData){
        const { data } = await api.post("/api/documents/upload", payload, {
            headers: {'Content-Type' : 'multipart/form-data'},
        });
        return { data };
    },

    async getDocuments(params?: { userId?: number; playerIds?: number[] }): Promise<Document[]> {
    const { data } = await api.get('/api/documents', {
      params: params
    });
    return data;
  },

  async getDocumentsByUser(userId: number): Promise<Document[]> {
    return this.getDocuments({ userId });
  },

  async getDocumentsByPlayerIds(playerIds: number[]): Promise<Document[]> {
    return this.getDocuments({ playerIds });
  },

   // ========== TYPES DE DOCUMENTS ==========

  async getDocumentTypes(options: GetDocumentTypesOptions = {}): Promise<DocumentType[]> {
  // Destructuration avec une valeur par défaut pour includeInactive
  const { id, name, names, includeInactive = false } = options;

  const { data } = await api.get('/api/documents/types', {
    params: { 
      id, 
      name, 
      names, 
      includeInactive 
    },
  });
  return data;
},

  async getDocumentTypeById(id: number): Promise<DocumentType> {
    const { data } = await api.get(`/api/documents/types/${id}`);
    return data;
  },

  async createDocumentType(data: CreateDocumentTypeDto): Promise<DocumentType> {
    const { data: docType } = await api.post('/api/documents/types', data);
    return docType;
  },

  async updateDocumentType(id: number, data: UpdateDocumentTypeDto): Promise<DocumentType> {
    const { data: docType } = await api.patch(`/api/documents/types/${id}`, data);
    return docType;
  },

  async deleteDocumentType(id: number): Promise<void> {
    await api.delete(`/api/documents/types/${id}`);
  },
}