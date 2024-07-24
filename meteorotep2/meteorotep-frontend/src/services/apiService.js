// services/apiService.js
import axios from "axios";

const apiService = axios.create({
    baseURL: 'http://localhost:3000/api',     // Ajusta la URL base según tu configuración
    timeout: 10000, // Tiempo máximo de espera de 10 segundos
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiService;
