// packages/shared/src/types/document.types.ts

import z from "zod";

//export type DocumentType = 'Certificat Medical' | 'Photo d\'identite' | 'Recu de Paiement' | 'Extrait de Naissance' | 'Autorisation Parentale' | 'Pièce d\'identité' | 'autre';

/* Pour la validation des string en document type. */
export const DocumentTypeSchema = z.enum([
  'Certificat Medical',
  "Photo d'identite",
  'Recu de Paiement',
  'Extrait de Naissance',
  'autre'
]);

export const DOCUMENT_STATUSES = {
  VALID: 'Validé',
  REJECTED: 'Rejeté',
  EXPIRED: 'Expiré',
  PENDING: 'En attente de Validation',
} as const;

export type DocumentStatus = typeof DOCUMENT_STATUSES[keyof typeof DOCUMENT_STATUSES];

export interface Document {
  id: number;
  userId?: number;
  type: DocumentType;
  fileId?: string;
  publicUrl?: string;
  documentStatus?: DocumentStatus;
  isObligatory?: boolean;
  validatedAt?: string | null;
  validatedBy?: number | null;
  uploadedAt?: string;
}



export interface inscriptionFile{
  fileType: DocumentType;
  file: File;
  isObligatory: boolean
}

export interface DocumentFile{
  fileType: string;
  file: File;
  isObligatory?: boolean
}

export interface DocumentType {
  id: number;
  name: string;
  description: string | null;
  isObligatory: boolean;
  applicableCategories: string[];
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentTypeDto {
  name: string;
  description?: string;
  isObligatory?: boolean;
  applicableCategories?: string[];
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateDocumentTypeDto extends Partial<CreateDocumentTypeDto> {}