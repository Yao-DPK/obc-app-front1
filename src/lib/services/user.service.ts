import api from '../axios';
import type { updateProfileDto, updateProfileResponse, User } from '@/types';

export const userService = {
  // ========== LECTURE ==========
  async fetchProfile(){
    const { data } = await api.get('/api/users/me');
    //console.log(`data: ${JSON.stringify(data)}`)
    return data;
  },

  async updateProfile(dto: updateProfileDto): Promise<{success: boolean}>{
    const { data } = await api.patch(`/api/users/me`, dto);
    return data;
  },


  async fetchUsers(): Promise<User[]> {
    const { data } = await api.get('/api/users');
    return data;
  },

  async fetchPlayers(): Promise<User[]> {
    const { data } = await api.get('/api/users/player');
    return data;
  },

  async fetchAdmins(): Promise<User[]> {
    const { data } = await api.get('/api/users/admin');
    return data;
  },

  async fetchParents(): Promise<User[]> {
    const { data } = await api.get('/api/users/parent');
    return data;
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
};