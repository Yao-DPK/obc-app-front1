import api from "../axios";

export const userService = {
    async fetchAdmins(){
        const { data } =  await api.get('/api/users/admin');
        return { data };
    },

    async fetchUsers(){
        const { data } =  await api.get('/api/users');
        return { data };
    },

    async fetchPlayers(){
        const { data } =  await api.get('/api/users/players');
        return { data };
    }
}