import React, { useState, useEffect } from 'react';
import EarthquakeService from '../../services/earthquakeService'; // Importa tu servicio de sismos
import ExcelService from '../../services/excelService'; // Importa tu servicio de Excel

const EarthquakeList = ({ cityName }) => {
  const [earthquakes, setEarthquakes] = useState([]);

  useEffect(() => {
    if (cityName) {
      fetchRecentEarthquakes();
    }
  }, [cityName]);

  const fetchRecentEarthquakes = async () => {
    try {
      const data = await EarthquakeService.getRecentEarthquakesByCity(cityName);
      debugger;
      setEarthquakes(data);
    } catch (error) {
      console.error('Error fetching recent earthquakes:', error);
    }
  };

  const exportEarthquakeReport = async () => {
    try {
      await ExcelService.generateEarthquakeReport(earthquakes, cityName);
      debugger;
      console.log('Earthquake report exported successfully.');
      // Aquí podrías mostrar una notificación o mensaje de éxito
    } catch (error) {
      console.error('Error exporting earthquake report:', error);
    }
  };

  return (
    <div>
      <h2>Recent Earthquakes in {cityName}</h2>
      <ul>
        {earthquakes.map((earthquake, index) => (
          <li key={index}>
            <strong>Date:</strong> {new Date(earthquake.properties.time).toLocaleString()} <br />
            <strong>Magnitude:</strong> {earthquake.properties.mag} <br />
            <strong>Location:</strong> {earthquake.properties.place}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EarthquakeList;
