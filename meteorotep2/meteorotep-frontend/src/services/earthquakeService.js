import axios from 'axios';

const baseUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu servidor backend

const getToken = () => {
  return localStorage.getItem('token'); // Obtén el token del almacenamiento local
};

const EarthquakeService = {
  getRecentEarthquakesByCity: async (cityName) => {
    try {
      const response = await axios.get(`${baseUrl}/earthquakes/recent-earthquakes?city=${cityName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent earthquakes by city:', error);
      throw error;
    }
  },

  getRecentEarthquakesByLocation: async (latitude, longitude) => {
    try {
      const response = await axios.get(`${baseUrl}/earthquakes/recent-earthquakes-by-location`, {
        params: {
          latitude,
          longitude
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent earthquakes by location:', error);
      throw error;
    }
  },

  exportEarthquakeReport: async (cityName) => {
    try {
      const response = await axios.get(`${baseUrl}/earthquakes/export-earthquake-report?city=${cityName}`, { responseType: 'blob' });
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `earthquake_report_${cityName}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting earthquake report:', error);
      throw error;
    }
  },

  saveSearchToFavorites: async (location) => {
    if (!location) {
      console.error('Location is required');
      throw new Error('Location is required');
    }
  
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token not found');
      }
      await axios.post(`${baseUrl}/earthquakes/save-favorite`, { location }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error saving search to favorites:', error);
      throw error;
    }
  },
  
  getFavoriteSearches: async (userId) => {
    try {
      const token = getToken(); // Obtén el token del almacenamiento local
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.get(`${baseUrl}/earthquakes/favorite-searches`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite searches:', error);
      throw error;
    }
  },

 // En tu servicio de sismos (earthquakeService.js)
saveSearchToHistory: async (city) => {
  try {
    const token = getToken(); // Obtén el token del almacenamiento local
    if (!token) {
      throw new Error('Token not found');
    }
    await axios.post(`${baseUrl}/earthquakes/save-history/${city}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error saving search to history:', error);
    throw error;
  }
},


  getSearchHistory: async (userId) => {
    try {
      const token = getToken(); // Obtén el token del almacenamiento local
      if (!token) {
        throw new Error('Token not found');
      }
      const response = await axios.get(`${baseUrl}/earthquakes/search-history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching search history:', error);
      throw error;
    }
  }
};

export default EarthquakeService;
