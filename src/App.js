import { Oval } from 'react-loader-spinner';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown, faBars } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function Weather() {
    const [input, setInput] = useState('');
    const [weather, setWeather] = useState({
        loading: true,
        data: {},
        error: false,
    });
    const [menuOpen, setMenuOpen] = useState(false);

    const toDateFunction = () => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        const WeekDays = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
        ];
        const currentDate = new Date();
        const date = `${WeekDays[currentDate.getDay()]} ${currentDate.getDate()} ${months[currentDate.getMonth()]}`;
        return date;
    };

    const fetchWeatherData = async (url) => {
        const api_key = 'e23baadac31cd2433d881b44def6bade';
        try {
            const { data } = await axios.get(url, {
                params: {
                    lat: weather.data.coord.lat,
                    lon: weather.data.coord.lon,
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
      // Fetch default weather data for Rawat, Pakistan when component mounts
      fetchWeatherData('Rawat,PK');
  }, [fetchWeatherData]);
  

    const search = async (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            setInput('');
            setWeather({ ...weather, loading: true });
            fetchWeatherData(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric`);
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuItemClick = async (menuItem) => {
        console.log("Clicked on:", menuItem);
        let url = '';
        if (menuItem === "Hourly Forecast 4 days" && weather.data && weather.data.coord) {
            url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${weather.data.coord.lat}&lon=${weather.data.coord.lon}`;
        } else if (menuItem === "Daily Forecast 16 days" && weather.data && weather.data.coord) {
            url = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${weather.data.coord.lat}&lon=${weather.data.coord.lon}&cnt=16`;
        } else if (menuItem === "Climatic Forecast 30 days" && weather.data && weather.data.coord) {
            url = `https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${weather.data.coord.lat}&lon=${weather.data.coord.lon}`;
        }
        if (url) {
            console.log("Fetching data from:", url);
            setWeather({ ...weather, loading: true });
            fetchWeatherData(url);
        }
        // Example: close the menu after clicking
        setMenuOpen(false);
    };

    return (
        <div className="App" style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2020/05/06/06/18/blue-5136251_640.jpg")', backgroundSize: 'cover' }}>
            <div className="menu-container">
                <h1 className="app-name" onClick={toggleMenu}>
                    Weather App
                </h1>
                <div className="menu-button" onClick={toggleMenu}>
                    <FontAwesomeIcon icon={faBars} />
                </div>
                {menuOpen && (
                    <div className="menu-options">
                        <ul>
                            <li onClick={() => handleMenuItemClick("Hourly Forecast 4 days")}>Hourly Forecast 4 days</li>
                            <li onClick={() => handleMenuItemClick("Daily Forecast 16 days")}>Daily Forecast 16 days</li>
                            <li onClick={() => handleMenuItemClick("Climatic Forecast 30 days")}>Climatic Forecast 30 days</li>
                        </ul>
                    </div>
                )}
            </div>
            {/* Conditional rendering for other components */}
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
                            onKeyPress={search}
                        />
                    </div>
                    {weather.loading && (
                        <>
                            <br />
                            <br />
                            <Oval type="Oval" color="black" height={100} width={100} />
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
                    {weather && weather.data && weather.data.main && (
                        <div>
                            <div className="city-name">
                                <h2>
                                    {weather.data.name}, <span>{weather.data.sys.country}</span>
                                </h2>
                            </div>
                            <div className="date">
                                <span>{toDateFunction()}</span>
                            </div>
                            <div className="icon-temp">
                                <img
                                    className=""
                                    src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                                    alt={weather.data.weather[0].description}
                                />
                                {Math.round(weather.data.main.temp)}
                                <sup className="deg">°C</sup>
                            </div>
                            <div className="des-wind">
                                <p>{weather.data.weather[0].description.toUpperCase()}</p>
                                <p>Wind Speed: {weather.data.wind.speed}m/s</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Weather;
