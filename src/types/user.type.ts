
export type UserRole = 'parent' | 'player' | 'admin' | 'super_admin';
export type RegistrationStatus = 'pre_inscrit' | 'inscrit' | 'actif' | 'suspendu' | 'parent_invité' | 'validé' | 'rejeté' | 'admin_actif' ;

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
}

export interface AttestationData {
  signatoryType: 'self' | 'guardian';
  selectedGuardianIndex?: number;
  signatoryFullName: string;
  acceptedTerms: boolean;
  signatureUrl: string;
}

export interface User {
  playerDetails: any;
  id: number;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: string | null;   // ISO date string
  gender?: 'M' | 'F' | null;
  phone?: string | null;
  address?: string | null;
  school?: string | null;
  class?: string | null;
  isVerified?: boolean | null;
  photoUrl?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  registrationStatus: RegistrationStatus;
  notificationPreferences: NotificationPreferences;
  attestationData?: AttestationData | null;
  createdAt: string;   // ISO datetime
  updatedAt: string;
}

export interface UpdateProfileDto{
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  photoUrl?: string;
}

export interface updateProfileResponse{
  user?: User;
  message?: string;
}

// Schemas
// src/schemas/user.schema.ts
import { z } from 'zod';

// Correspond au DTO UpdateProfileDto du backend
export const updateProfileSchema = z.object({
  // Champs communs
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  gender: z.enum(['M', 'F']).optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  photoUrl: z.string().optional(),
  notificationPreferences: z.object({
    email: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional(),
  }).optional(),
  registrationStatus: z.enum(['pre_inscrit', 'inscrit', 'rejeté', 'suspendu', 'parent_invité', 'parent_inscrit', 'admin_actif', 'actif', 'validé']).optional(),

  // Champs joueur (uniquement pour les joueurs)
  birthDate: z.string().optional(),
  school: z.string().optional(),
  class: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  attestationData: z.object({
    signatoryType: z.enum(['self', 'guardian']),
    selectedGuardianIndex: z.number().optional(),
    signatoryFullName: z.string(),
    acceptedTerms: z.boolean(),
    signatureUrl: z.string(),
  }).optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;