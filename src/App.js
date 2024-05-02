import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faBars } from '@fortawesome/free-solid-svg-icons';
import { Oval } from 'react-loader-spinner'; // Import Oval component
import './App.css';
import WeatherDisplayPage from './WeatherDisplayPage';

function App() {
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({
        loading: true,
        data: {},
        error: false,
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const [forecastData, setForecastData] = useState(null);

    const fetchWeatherData = async (city) => {
        const url = 'https://api.openweathermap.org/data/2.5/weather';
        const api_key = 'e23baadac31cd2433d881b44def6bade';
        try {
            const { data } = await axios.get(url, {
                params: {
                    q: city,
                    units: 'metric',
                    appid: api_key,
                },
            });
            console.log('Weather Data:', data);
            setWeather({ data: data, loading: false, error: false });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeather({ data: {}, loading: false, error: true });
        }
    };

    useEffect(() => {
        fetchWeatherData('Rawat,PK');
    }, []);

    const handleMenuItemClick = async (menuItem) => {
        console.log("Clicked on:", menuItem);
        if (menuItem === "Hourly Forecast 4 days" && weather.data && weather.data.coord) {
            console.log("Fetching hourly forecast data...");
            const url = 'https://pro.openweathermap.org/data/2.5/forecast/hourly';
            const api_key = 'e23baadac31cd2433d881b44def6bade'; 
            try {
                const { data } = await axios.get(url, {
                    params: {
                        lat: weather.data.coord.lat,
                        lon: weather.data.coord.lon,
                        appid: api_key,
                    },
                });
                console.log('Hourly Forecast:', data);
                setForecastData(data);
                setMenuOpen(false); // Close the menu after selecting a menu item
            } catch (error) {
                console.error('Error fetching hourly forecast data:', error);
            }
        }
    };

    const navigateToDisplayPage = () => {
        return <WeatherDisplayPage forecastData={forecastData} />;
    };

    return (
        <div className="App" style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2020/05/06/06/18/blue-5136251_640.jpg")', backgroundSize: 'cover' }}>
            <div className="menu-container">
                <h1 className="app-name" onClick={() => setMenuOpen(!menuOpen)}>
                    Weather App
                </h1>
                <div className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                {menuOpen && (
                    <div className="menu-options">
                        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                            <li onClick={() => handleMenuItemClick("Hourly Forecast 4 days")}>Hourly Forecast 4 days</li>
                            <li onClick={() => handleMenuItemClick("Daily Forecast 16 days")}>Daily Forecast 16 days</li>
                            <li onClick={() => handleMenuItemClick("Climatic Forecast 30 days")}>Climatic Forecast 30 days</li>
                        </ul>
                    </div>
                )}
            </div>
            {!menuOpen && (
                <div>
                    <div className="search-bar">
                        <input
                            type="text"
                            className="city-search"
                            placeholder="Enter City Name.."
                            name="query"
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    fetchWeatherData(input);
                                }
                            }}
                        />
                    </div>
                    {weather.loading && (
                        <>
                            <br />
                            <br />
                            <Oval type="Oval" color="black" height={100} width={100} /> {/* Use Oval component here */}
                        </>
                    )}
                    {weather.error && (
                        <>
                            <br />
                            <br />
                            <span className="error-message">
                                <FontAwesomeIcon icon={faFrown} />
                                <span style={{ fontSize: '20px' }}>City not found</span>
                            </span>
                        </>
                    )}
                    {forecastData && navigateToDisplayPage()}
                </div>
            )}
        </div>
    );
}

export default App;
