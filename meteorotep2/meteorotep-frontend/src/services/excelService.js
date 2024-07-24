import axios from "axios";

const baseUrl = 'http://localhost:3000/api'; // Reemplaza con la URL de tu servidor backend

const ExcelService = {
  generateEarthquakeReport: async (city) => {
    try {
      const response = await axios.get(`${baseUrl}/earthquakes/export-earthquake-report?city=${city}`, {
        responseType: 'blob' // Asegúrate de que la respuesta sea de tipo blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `earthquake_report_${city}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating earthquake report:', error);
      throw error;
    }
  },

  generateDailyForecastReport: async (city) => {
    try {
      const token = localStorage.getItem('token'); // Obtener el token desde localStorage
      const response = await axios.get(`${baseUrl}/weather/export-daily-forecast?city=${city}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Incluir el token en la cabecera de la solicitud
        },
        responseType: 'blob' // Asegúrate de que la respuesta sea de tipo blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `daily_forecast_${city}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating daily forecast report:', error);
      throw error;
    }
  },
};

export default ExcelService;
