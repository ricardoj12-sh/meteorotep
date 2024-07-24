import React, { useState, useEffect } from 'react';
import WeatherService from '../../services/weatherService2';
import ExcelService from '../../services/excelService'; // Importa tu servicio de Excel

const WeatherDisplay = ({ lat, lon, city }) => {
    const [dailyForecast, setDailyForecast] = useState([]);
    const [currentWeather, setCurrentWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                let weatherData;
                if (lat && lon) {
                    // Obtener clima actual y pronóstico por ubicación del usuario
                    weatherData = await WeatherService.getCurrentWeatherAndForecastByCoords(lat, lon);
                } else if (city) {
                    // Obtener clima actual y pronóstico por ciudad
                    weatherData = await WeatherService.getCurrentWeatherAndForecast(city);
                }
                // Asignar los datos recibidos al estado
                setCurrentWeather(weatherData.currentWeather);
                setDailyForecast(weatherData.dailyForecast); // Cambié `forecast` por `dailyForecast`
                setLoading(false);
            } catch (error) {
                console.error('Error fetching weather data:', error);
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [lat, lon, city]);

    const exportDailyForecastReport = async () => {
        try {
            await ExcelService.exportDailyForecastToExcel(city); // Asegúrate de que el nombre del método sea el correcto
            console.log('Daily forecast report exported successfully.');
            // Aquí podrías mostrar una notificación o mensaje de éxito
        } catch (error) {
            console.error('Error exporting daily forecast report:', error);
        }
    };

    if (loading) {
        return <p>Cargando datos de clima...</p>;
    }

    return (
        <div>
            <h2>Clima Actual y Pronóstico de 7 días</h2>
            {currentWeather && (
                <div>
                    <p>Temperatura actual: {currentWeather.temperature?.current} °C</p>
                    <p>Descripción: {currentWeather.weatherDescription}</p>
                    {/* Otros detalles del clima actual */}
                </div>
            )}
            {dailyForecast.length > 0 && (
                <div>
                    <h3>Pronóstico de 7 días</h3>
                    <ul>
                        {dailyForecast.map((day, index) => (
                            <li key={index}>
                                <h3>{day.dayOfWeek}</h3>
                                <p>Fecha: {day.date}</p>
                                <p>Temperatura máxima: {day.temperature?.max || 'N/A'} °C</p>
                                <p>Temperatura mínima: {day.temperature?.min || 'N/A'} °C</p>
                                <p>Temperatura día: {day.temperature?.day || 'N/A'} °C</p>
                                <p>Temperatura noche: {day.temperature?.night || 'N/A'} °C</p>
                                <p>Temperatura tarde: {day.temperature?.eve || 'N/A'} °C</p>
                                <p>Temperatura mañana: {day.temperature?.morn || 'N/A'} °C</p>
                                <p>Presión: {day.pressure || 'N/A'}</p>
                                <p>Humedad: {day.humidity || 'N/A'}%</p>
                                <p>Velocidad del viento: {day.speed || 'N/A'} m/s</p>
                                {/* Otros detalles del pronóstico diario */}
                            </li>
                        ))}
                    </ul>
                    <button onClick={exportDailyForecastReport}>Exportar Reporte de Pronóstico Diario</button>
                </div>
            )}
        </div>
    );
};

export default WeatherDisplay;
