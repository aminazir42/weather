import { Oval } from "react-loader-spinner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown, faBars } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import { API_URl,API_KEY, WEEKDAYS, MONTHS } from "./utils/constants";

function Weather() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [forecastData, setForecastData] = useState(null);

  const toDateFunction = () => {
    const currentDate = new Date();
    const date = `${WEEKDAYS[currentDate.getDay()]} ${currentDate.getDate()} ${
      MONTHS[currentDate.getMonth()]
    }`;
    return date;
  };

  const fetchWeatherData = async (city) => {
    const url = `${API_URl}/weather`;
    try {
      const { data } = await axios.get(url, {
        params: {
          q: city,
          units: "metric",
          appid: API_KEY,
        },
      });
      console.log("Weather Data:", data);
      setWeather({ data: data, loading: false, error: false });
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeather({ data: {}, loading: false, error: true });
    }
  };

  useEffect(() => {
    fetchWeatherData("Rawat,PK");
  }, []);

  const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setInput("");
      setWeather({ ...weather, loading: true });
      fetchWeatherData(input);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleMenuItemClick = async (menuItem) => {
    console.log("Clicked on:", menuItem);
    if (menuItem === "Hourly Forecast 4 days") {
      console.log("Fetching hourly forecast data...");
      let lat, lon, cnt;
      if (weather.data && weather.data.coord) {
        lat = weather.data.coord.lat;
        lon = weather.data.coord.lon;
        cnt = 4;
      }
      const url =`${API_URl}/forecast`;
      try {
        const { data } = await axios.get(url, {
          params: {
            lat,
            lon,
            cnt,
            appid: API_KEY,
          },
        });
        console.log("Hourly Forecast:", data);
        setForecastData(data);
      } catch (error) {
        console.error("Error fetching hourly forecast data:", error);
      }
    }
    setMenuOpen(false);
  };
  return (
    <div
      className="App"
      style={{
        backgroundImage:
          'url("https://cdn.pixabay.com/photo/2020/05/06/06/18/blue-5136251_640.jpg")',
        backgroundSize: "cover",
      }}
    >
      <div className="menu-container">
        <h1 className="app-name" onClick={toggleMenu}>
          Weather App
        </h1>
        <div className="menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        {menuOpen && (
          <div className="menu-options">
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              <li onClick={() => handleMenuItemClick("Hourly Forecast 4 days")}>
                Hourly Forecast 4 days
              </li>
              <li onClick={() => handleMenuItemClick("Daily Forecast 16 days")}>
                Daily Forecast 16 days
              </li>
              <li
                onClick={() => handleMenuItemClick("Climatic Forecast 30 days")}
              >
                Climatic Forecast 30 days
              </li>
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
              onKeyPress={search}
            />
          </div>
          {weather.loading && (
            <div className="Loader">
              <Oval type="Oval" color="black" height={100} width={100} />
            </div>
          )}

          {weather.error && (
            <>
              <br />
              <br />
              <span className="error-message">
                <FontAwesomeIcon icon={faFrown} />
                <span style={{ fontSize: "20px" }}>City not found</span>
              </span>
            </>
          )}

          {weather.data.main && (
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
          {forecastData && (
            <div className="forecast-container">
              <h2>Hourly Forecast</h2>
              <div className="hourly-forecast">
                {forecastData.list.map((hourlyData, index) => (
                  <div key={index} className="hourly-data">
                    <div className="hourly-info">
                      <p>
                        Time:{" "}
                        {new Date(hourlyData.dt * 1000).toLocaleTimeString()}
                      </p>
                      <p>Temperature: {hourlyData.main.temp}°C</p>
                      <p>Feels Like: {hourlyData.main.feels_like}°C</p>
                      <p>Pressure: {hourlyData.main.pressure}hPa</p>
                      <p>Humidity: {hourlyData.main.humidity}%</p>
                      <p>Description: {hourlyData.weather[0].description}</p>
                      <p>Wind Speed: {hourlyData.wind.speed}m/s</p>
                      <p>Wind Direction: {hourlyData.wind.deg}°</p>
                    </div>
                    <div className="weather-icon">
                      <img
                        src={`https://openweathermap.org/img/wn/${hourlyData.weather[0].icon}.png`}
                        alt={hourlyData.weather[0].description}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Weather;