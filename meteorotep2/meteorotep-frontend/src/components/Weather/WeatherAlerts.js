import React from 'react';

const WeatherAlerts = ({ alerts }) => {
    if (!alerts || alerts.length === 0) {
        return null;
    }

    return (
        <div>
            <h3>Alertas Meteorológicas</h3>
            <ul>
                {alerts.map((alert, index) => (
                    <li key={index}>
                        <p>Titulo: {alert.title}</p>
                        <p>Descripción: {alert.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WeatherAlerts;
