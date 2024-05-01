import React from 'react';

function HourlyForecast({ hourlyData }) {
    return (
        <div>
            <h2>Hourly Forecast</h2>
            <ul>
                {hourlyData.map((hour, index) => (
                    <li key={index}>
                        {hour.dt_txt}: {hour.main.temp}°C, {hour.weather[0].description}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default HourlyForecast;
