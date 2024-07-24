import React, { useState, useEffect } from 'react';
import EarthquakeList from '../Earthquake/EarthquakeList';
import EarthquakeService from '../../services/earthquakeService';
import ExcelService from '../../services/excelService';

function EarthquakePage() {
  const [cityName, setCityName] = useState('');
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await fetchRecentEarthquakes();
      setEarthquakes(data);
      if (cityName.trim() !== '') {
        await saveSearchToHistory(cityName);
      }
    } catch (error) {
      console.error('Error searching for earthquakes:', error);
      // Puedes añadir notificaciones de error aquí
    } finally {
      setLoading(false);
    }
  };

  const saveSearchToHistory = async (city) => {
    try {
      await EarthquakeService.saveSearchToHistory(city);
      await fetchSearchHistory();
    } catch (error) {
      console.error('Error saving search to history:', error);
      // Puedes añadir notificaciones de error aquí
    }
  };

  const fetchRecentEarthquakes = async () => {
    try {
      const data = await EarthquakeService.getRecentEarthquakesByCity(cityName);
      return data.features;
    } catch (error) {
      console.error('Error fetching recent earthquakes:', error);
      return [];
    }
  };

  const exportEarthquakeReport = async () => {
    try {
      await ExcelService.generateEarthquakeReport(cityName);
    } catch (error) {
      console.error('Error exporting earthquake report:', error);
      // Puedes añadir notificaciones de error aquí
    }
  };

  const handleSaveToFavorites = async () => {
    try {
      await EarthquakeService.saveSearchToFavorites(cityName);
      await fetchFavoriteSearches();
    } catch (error) {
      console.error('Error saving search to favorites:', error);
      // Puedes añadir notificaciones de error aquí
    }
  };

  const fetchFavoriteSearches = async () => {
    try {
      const data = await EarthquakeService.getFavoriteSearches();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorite searches:', error);
    }
  };

  const fetchSearchHistory = async () => {
    try {
      const data = await EarthquakeService.getSearchHistory();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  useEffect(() => {
    if (showHistory) {
      fetchSearchHistory();
    }
  }, [showHistory]);

  useEffect(() => {
    if (showFavorites) {
      fetchFavoriteSearches();
    }
  }, [showFavorites]);

  return (
    <div>
      <h1>Earthquake Page</h1>
      <div className="earthquake-input">
        <h3>Search Earthquakes by City</h3>
        <input
          type="text"
          placeholder="Enter city name"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={handleSaveToFavorites}>Save to Favorites</button>
        <button onClick={() => setShowHistory(prev => !prev)}>
          {showHistory ? 'Hide Search History' : 'Show Search History'}
        </button>
        <button onClick={() => setShowFavorites(prev => !prev)}>
          {showFavorites ? 'Hide Favorites' : 'Show Favorites'}
        </button>
      </div>
      {cityName && (
        <div>
          <EarthquakeList
            cityName={cityName}
            earthquakes={earthquakes}
          />
          <button onClick={exportEarthquakeReport}>Export Earthquake Report</button>
        </div>
      )}
      {showFavorites && (
        <div>
          <h3>Favorites</h3>
          <ul>
            {favorites.map((favorite, index) => (
              <li key={index}>{favorite.search_query}</li>
            ))}
          </ul>
        </div>
      )}
      {showHistory && (
        <div>
          <h3>Search History</h3>
          <ul>
            {history.map((record, index) => (
              <li key={index}>{record.search_query}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default EarthquakePage;
