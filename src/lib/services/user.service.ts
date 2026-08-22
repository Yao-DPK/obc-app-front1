// src/lib/services/user.service.ts
import api from '../axios';
import type { UpdateProfileDto, User } from '@/types';

// Types pour les filtres
export interface UserFilters {
  role?: 'player' | 'parent' | 'admin' | 'super_admin' | string;
  search?: string;
  isVerified?: boolean;
  registrationStatus?: string | string[];
  createdFrom?: string;
  createdTo?: string;
}

export const userService = {
  // ========== LECTURE ==========

  async fetchProfile(): Promise<User> {
    const { data } = await api.get('/api/users/me');
    return data;
  },

  async fetchProfilePicture(): Promise<{ signedUrl: string }> {
    const { data } = await api.get('/api/users/me/photo');
    return data;
  },

  async fetchUserPicture(userId: number): Promise<{ signedUrl: string }> {
    const { data } = await api.get(`/api/users/photo/${userId}`);
    return data;
  },

  /**
   * Récupère la liste des utilisateurs avec filtres optionnels.
   * Exemple : fetchUsers({ role: 'player', search: 'Konan', isVerified: true })
   */
  async fetchUsers(filters?: UserFilters): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.isVerified !== undefined) params.append('isVerified', String(filters.isVerified));
    if (filters?.registrationStatus) {
      const statuses = Array.isArray(filters.registrationStatus)
        ? filters.registrationStatus
        : [filters.registrationStatus];
      statuses.forEach(s => params.append('registrationStatus', s));
    }
    if (filters?.createdFrom) params.append('createdFrom', filters.createdFrom);
    if (filters?.createdTo) params.append('createdTo', filters.createdTo);

    const url = `/api/users${params.toString() ? `?${params.toString()}` : ''}`;
    const { data } = await api.get(url);
    return data;
  },

  // Méthodes dédiées (conservées pour la clarté)
  async fetchPlayers(): Promise<User[]> {
    return this.fetchUsers({ role: 'player' });
  },

  async fetchAdmins(): Promise<User[]> {
    return this.fetchUsers({ role: 'admin' });
  },

  async fetchParents(): Promise<User[]> {
    return this.fetchUsers({ role: 'parent' });
  },

  async fetchUserById(id: number): Promise<User> {
    const { data } = await api.get(`/api/users/${id}`);
    return data;
  },

  async fetchUserByRoleAndId(id: number, role: string): Promise<User> {
    const { data } = await api.get(`/api/users/${role}/${id}`);
    return data;
  },

  async fetchBatchUsers(ids: number[]): Promise<User[]> {
    const { data } = await api.post('/api/users/batch', { ids });
    return data;
  },

  // ========== MISE À JOUR ==========

  async updateProfile(dto: UpdateProfileDto): Promise<{ success: true }> {
    const { data } = await api.patch('/api/users/me', dto);
    return data;
  },

  async updateUser(userId: number, payload: Partial<User>): Promise<User> {
    const { data } = await api.patch(`/api/users/${userId}`, payload);
    return data;
  },

  async updateStatus(userId: number, status: string): Promise<void> {
    await api.patch(`/api/users/${userId}/status`, { status });
  },

  async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<void> {
    await api.patch(`/api/users/${userId}/change-password`, { oldPassword, newPassword });
  },

  // ========== UPLOAD PHOTO ==========

  async uploadProfilePicture(file: File): Promise<{ success: boolean; document: any }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/api/users/me/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};