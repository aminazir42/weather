import React from 'react';

const WeatherDisplayPage = ({ forecastData }) => {
    return (
        <div className="weather-display-page">
            <h2>Hourly Forecast</h2>
            {forecastData && forecastData.list.map((hourlyData, index) => (
                <div key={index} className="hourly-data">
                    <p>Time: {new Date(hourlyData.dt * 1000).toLocaleTimeString()}</p>
                    <p>Temperature: {hourlyData.main.temp}°C</p>
                    <p>Feels Like: {hourlyData.main.feels_like}°C</p>
                    <p>Pressure: {hourlyData.main.pressure}hPa</p>
                    <p>Humidity: {hourlyData.main.humidity}%</p>
                    <p>Description: {hourlyData.weather[0].description}</p>
                    <img
                        src={`https://openweathermap.org/img/wn/${hourlyData.weather[0].icon}.png`}
                        alt={hourlyData.weather[0].description}
                    />
                    <p>Wind Speed: {hourlyData.wind.speed}m/s</p>
                    <p>Wind Direction: {hourlyData.wind.deg}°</p>
                </div>
            ))}
        </div>
    );
}

export default WeatherDisplayPage;
