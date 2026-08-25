
export type Relationship = 'Mère' | 'Père' | 'Tuteur';

export interface GuardianPermissions {
  canPay?: boolean;
  canRegister?: boolean;
}

export interface GuardianRelationship {
  id: number;
  guardianId: number;
  playerId: number;
  relationship: Relationship;
  permissions: GuardianPermissions;
  createdAt: string;
}