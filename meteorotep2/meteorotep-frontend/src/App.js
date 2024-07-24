import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import logo from './icono3.jpg';
import WeatherService from './services/weatherService2';
import EarthquakePage from '../src/components/pages/earthquakePage'; // Asegúrate de que la ruta es correcta


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentWeather, setCurrentWeather] = useState({
    city: '',
    country: '',
    temperature: '',
    weatherDescription: '',
    weatherMain: '',
    windSpeed: '',
    humidity: '',
    dailyForecast: [],
  });
  const [city, setCity] = useState('');

  // Comprobar si el usuario ya está autenticado al cargar el componente
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setLoggedIn(true);
    }
  }, []);

  // Registrar nuevo usuario
  const handleRegister = async () => {
    try {
      const userData = { username, password, email };
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        throw new Error('Error al registrar el usuario');
      }
      alert('Usuario registrado correctamente');
    } catch (error) {
      console.error('Error registrando usuario:', error);
      alert('Hubo un error al registrar el usuario');
    }
  };

  // Iniciar sesión del usuario
  const handleLogin = async () => {
    try {
      const credentials = { username, password };
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      if (!response.ok) {
        throw new Error('Error en el inicio de sesión');
      }
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        setLoggedIn(true);
        localStorage.setItem('token', data.token);
        alert('Inicio de sesión exitoso');
      } else {
        throw new Error('Token no encontrado en la respuesta');
      }
    } catch (error) {
      console.error('Error iniciando sesión:', error);
      alert('Usuario o contraseña incorrectos');
    }
  };

  // Cerrar sesión del usuario
  const handleLogout = () => {
    setLoggedIn(false);
    setToken('');
    localStorage.removeItem('token');
  };
  const getDayOfWeek = (dateStr) => {
    const date = new Date(dateStr);
    const options = { weekday: 'long' };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
  };
  

  const fetchWeatherByCity = async (cityOrLat, lon = null) => {
    let token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/weather/currentAndForecast?${lon ? `lat=${cityOrLat}&lon=${lon}` : `city=${cityOrLat}`}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.status === 401) {
        const refreshResponse = await fetch('http://localhost:3000/api/auth/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          token = refreshData.token;
          localStorage.setItem('token', token);
  
          const retryResponse = await fetch(`http://localhost:3000/api/weather/currentAndForecast?${lon ? `lat=${cityOrLat}&lon=${lon}` : `city=${cityOrLat}`}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
  
          if (!retryResponse.ok) {
            throw new Error('Failed to fetch weather data');
          }
  
          const retryData = await retryResponse.json();
          setCurrentWeather({
            city: retryData.currentWeather.name,
            country: retryData.currentWeather.country,
            temperature: retryData.currentWeather.temp,
            weatherDescription: retryData.currentWeather.description,
            weatherMain: retryData.currentWeather.main,
            windSpeed: retryData.currentWeather.speed,
            humidity: retryData.currentWeather.humidity,
            dailyForecast: retryData.forecast.map(day => ({
              ...day,
              dayOfWeek: getDayOfWeek(day.date)
            }))
          });
        } else {
          throw new Error('Failed to refresh token');
        }
      } else {
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
  
        const data = await response.json();
        setCurrentWeather({
          city: data.currentWeather.name,
          country: data.currentWeather.country,
          temperature: data.currentWeather.temp,
          weatherDescription: data.currentWeather.description,
          weatherMain: data.currentWeather.main,
          windSpeed: data.currentWeather.speed,
          humidity: data.currentWeather.humidity,
          dailyForecast: data.forecast.map(day => ({
            ...day,
            dayOfWeek: getDayOfWeek(day.date)
          }))
        });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };
  
  
  // Obtener la ubicación del usuario y buscar clima
  const getLocationAndFetchWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCity(latitude, longitude);
      }, (error) => {
        console.error('Error obteniendo ubicación:', error);
      });
    } else {
      alert('Tu navegador no soporta geolocalización');
    }
  };

  // Buscar clima por ciudad
  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherByCity(city);
    } else {
      alert('Por favor, ingresa una ciudad.');
    }
  };

  // Exportar reporte del clima diario a Excel
  const exportDailyForecastReport = async () => {
    try {
      await WeatherService.exportDailyForecastToExcel(city);
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1>Aplicación de Clima</h1>
      {loggedIn ? (
        <div>
          <button onClick={handleLogout}>Cerrar sesión</button>
          <button onClick={getLocationAndFetchWeather}>Obtener clima actual</button>
          <input 
            type="text" 
            value={city} 
            onChange={(e) => setCity(e.target.value)} 
            placeholder="Buscar ciudad" 
          />
          <button onClick={handleSearch}>Buscar</button>
          {currentWeather.dailyForecast && currentWeather.dailyForecast.length > 0 && (
            <button onClick={exportDailyForecastReport}>Exportar reporte</button>
          )}
          <div>
            <h2>Clima Actual en {currentWeather.city}, {currentWeather.country}</h2>
            <p>Temperatura: {currentWeather.temperature}°C</p>
            <p>Descripción: {currentWeather.weatherDescription}</p>
            <p>Velocidad del Viento: {currentWeather.windSpeed} m/s</p>
            <p>Humedad: {currentWeather.humidity}%</p>
          </div>
          {currentWeather.dailyForecast && (
            <div className="days-forecast">
              <h2>Pronóstico a 5 Días</h2>
              <ul className="weather-cards">
                {Array.isArray(currentWeather.dailyForecast) && currentWeather.dailyForecast.length > 0 ? (
                  currentWeather.dailyForecast.map((day, index) => (
                    <li key={index} className="card">
                      <h3>{day.dayOfWeek}</h3>
                      <h6>Temp Día: {day.temperature !== undefined ? day.temperature + '°C' : 'N/A°C'}</h6>
                      <h6>Pressure: {day.pressure !== undefined ? day.pressure: 'N/A°C'}</h6>
                      <h6>Clouds: {day.clouds !== undefined ? day.clouds: 'N/A°C'}</h6>
                      <h6>Winds: {day.WindSpeed !== undefined  ? day.WindSpeed: 'N/A°C' }</h6>
                      <h6>Humidity: {day.humidity !== undefined  ? day.humidity + '°C' : 'N/A°C'}%</h6>
                      <h6>Feels Like: {day.feels_like !== undefined  ? day.feels_like + '°C' : 'N/A°C'}%</h6>

                      <p>Descripción: {day.weather}</p>
                    </li>
                  ))
                ) : (
                  <li>No se encontraron datos del pronóstico.</li>
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>Iniciar sesión</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
          <button onClick={handleLogin}>Iniciar sesión</button>
          <h2>Registrarse</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
          />
          <button onClick={handleRegister}>Registrarse</button>
        </div>
      )}
    </header>
    <nav>
      <Link to="/earthquakes">Ver terremotos</Link>
    </nav>
    <Routes>
      <Route path="/earthquakes" element={<EarthquakePage />} />
      {/* Otras rutas pueden ir aquí */}
    </Routes>
  </div>
);
}

export default App;
