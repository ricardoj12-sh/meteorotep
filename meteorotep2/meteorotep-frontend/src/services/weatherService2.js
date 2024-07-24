import axios from 'axios';

const baseUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu servidor backend

// Función para obtener el token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };
};

const WeatherService = {
  getCurrentWeatherAndForecastByCoords: async (latitude, longitude) => {
    try {
      const response = await axios.get(`${baseUrl}/weather/currentAndForecast?lat=${latitude}&lon=${longitude}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather and forecast by coordinates:', error);
      throw error;
    }
  },
  
  getDailyForecast: async (city) => {
    try {
      const response = await axios.get(`${baseUrl}/weather/daily-forecast?city=${city}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily forecast:', error);
      throw error;
    }
  },
  
  getCurrentWeatherAndForecast: async (city) => {
    try {
      const response = await axios.get(`${baseUrl}/weather/currentAndForecast?city=${city}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather and forecast by city:', error);
      throw error;
    }
  },
  
  getCurrentWeather: async (city) => {
    try {
      const response = await axios.get(`${baseUrl}/weather/current-weather/${city}`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      throw error;
    }
  },
  
  exportDailyForecastToExcel: async (city) => {
    try {
      const response = await axios.get(`${baseUrl}/weather/export-daily-forecast?city=${city}`, {
        responseType: 'blob', // Para recibir un archivo binario (Excel)
        headers: getAuthHeaders() // Incluye los encabezados de autenticación
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `daily_forecast_${city}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error exporting daily forecast:', error);
      throw error;
    }
  },
  
  saveSearchToHistory: async (city) => {
    try {
      const response = await axios.post(`${baseUrl}/weather/save-history/${city}`, {}, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error saving search to history:', error);
      throw error;
    }
  },

  
  getSearchHistory: async () => {
    try {
      const response = await axios.get(`${baseUrl}/weather/search-history`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching search history:', error);
      throw error;
    }
  },
  
  saveSearchToFavorites: async (location) => {
    try {
      const response = await axios.post(`${baseUrl}/weather/save-favorite`, { location }, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error saving search to favorites:', error);
      throw error;
    }
  },
  
  getFavoriteSearches: async () => {
    try {
      const response = await axios.get(`${baseUrl}/weather/favorite-searches`, {
        headers: getAuthHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite searches:', error);
      throw error;
    }
  },
};

export default WeatherService;
