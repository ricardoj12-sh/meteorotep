// services/authService.js
import apiService from './apiService';

const authService = {
    register: async (userData) => {
        try {
            const response = await apiService.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },
    
    login: async (credentials) => {
        try {
            const response = await apiService.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }

};

export default authService;
