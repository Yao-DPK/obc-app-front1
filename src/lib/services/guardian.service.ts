import api from '../axios';
import type { GuardianRelationship, User } from '@/types';

export const guardianService = {
  // ========== LECTURE ==========
  async getMyPlayers(): Promise<User[]> {
    const { data } = await api.get(`/api/guardian/players`);
    return data; // ou data selon la réponse du backend
  },

  async getPlayers(guardianId: number): Promise<User[]> {
    const { data } = await api.get(`/api/guardian/players/${guardianId}`);
    return data; // ou data selon la réponse du backend
  },

  async getGuardians(playerId: number): Promise<User[]> {
    const { data } = await api.get(`/api/guardian/guardians/${playerId}`);
    return data; // ou data selon la réponse du backend
  },

  async getPlayersWithDetails(guardianId: number): Promise<User[]> {
    const { data } = await api.get(`/api/guardian/players/${guardianId}`);
    // Si le backend retourne les users complets, sinon faire un fetch batch
    return data;
  },

  async getGuardiansWithDetails(playerId: number): Promise<User[]> {
    const { data } = await api.get(`/api/guardian/guardians/${playerId}`);
    return data;
  },

  // ========== CRÉATION ==========

  async linkPlayer(guardianId: number, playerId: number, permissions?: any): Promise<GuardianRelationship> {
    const { data } = await api.post('/api/guardian/link', { guardianId, playerId, permissions });
    return data;
  },

  // ========== SUPPRESSION ==========

  async unlinkPlayer(guardianId: number, playerId: number): Promise<void> {
    await api.delete('/api/guardian/unlink', { data: { guardianId, playerId } });
  },

  // ========== MISE À JOUR ==========

  async updatePermissions(guardianId: number, playerId: number, permissions: any): Promise<GuardianRelationship> {
    const { data } = await api.patch('/api/guardian/permissions', { guardianId, playerId, permissions });
    return data;
  },

  // ========== VÉRIFICATION ==========

  async checkRelation(guardianId: number, playerId: number): Promise<{ exists: boolean; link?: GuardianRelationship }> {
    const { data } = await api.get(`/api/guardian/check/${guardianId}/${playerId}`);
    return data;
  },
};