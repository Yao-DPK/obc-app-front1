
// packages/shared/src/types/user.types.ts

export type UserRole = 'parent' | 'player' | 'admin' | 'super_admin';
export type RegistrationStatus = 'pre_inscrit' | 'inscrit' | 'actif' | 'suspendu' | 'parent_invité' | 'validé' | 'attestation_signee';
export type RegistrationStep = 'formulaire' | 'attestation_signee' | 'validation_admin' | 'complet';

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
  photoUrl?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  registrationStatus: RegistrationStatus;
  registrationStep: RegistrationStep;
  notificationPreferences: NotificationPreferences;
  attestationData?: AttestationData | null;
  createdAt: string;   // ISO datetime
  updatedAt: string;
}

export interface updateProfileDto{
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