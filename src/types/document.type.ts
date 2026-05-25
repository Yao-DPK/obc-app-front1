// packages/shared/src/types/document.types.ts

export type DocumentType = 'certificat_medical' | 'photo_identite' | 'paiement_reçu' | 'autre';

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