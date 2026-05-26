// packages/shared/src/types/document.types.ts

export type DocumentType = 'Certificat Médical' | 'Photo d\'identité' | 'Recu de Paiement' | 'Extrait de Naissance' | 'autre';

export interface Document {
  id: number;
  userId: number;
  type: DocumentType;
  fileId: string;
  publicUrl: string;
  isObligatory: boolean;
  validatedAt?: string | null;   // ISO datetime
  uploadedAt: string;
}

export interface inscriptionFile{
  fileType: DocumentType;
  file: File;
  isObligatory: boolean
}