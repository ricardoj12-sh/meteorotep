// locationservice.js

import axios from "axios";
const baseUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu servidor backend

const LocationService = {
  getLocationByCity: async (cityName) => {
    try {
      const response = await axios.get(`${baseUrl}/location/getLocationByCity?cityName=${cityName}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching location by city:', error);
      throw error;
    }
  },
};

export default LocationService;
