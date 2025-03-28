import React, { useState } from "react";
import './WeatherApp.css';

const WeatherApp = () => {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "527ed1d4aac67d322f452f60a65c9968";

  const fetchWeather = async () => {
    if (!lat || !lon) {
      setError("Please enter both latitude and longitude");
      return;
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      setError("Invalid coordinates: Lat [-90,90], Lon [-180,180]");
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather data. Please check coordinates.");
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather();
    }
  };

  return (
    <div className="weather-app">
      <h1 className="title">Weather Finder</h1>

      <div className="input-container">
        <div className="input-group">
          <label>Latitude:</label>
          <input
            type="number"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter latitude (-90 to 90)"
            className="coordinate-input"
          />
        </div>

        <div className="input-group">
          <label>Longitude:</label>
          <input
            type="number"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter longitude (-180 to 180)"
            className="coordinate-input"
          />
        </div>

        <button 
          onClick={fetchWeather} 
          disabled={loading}
          className="fetch-button"
        >
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2 className="location">{weather.name}</h2>
          <div className="weather-details">
            <p className="weather-item">
              <span className="label">Temperature:</span>
              <span className="value">{weather.main.temp}°C</span>
            </p>
            <p className="weather-item">
              <span className="label">Feels Like:</span>
              <span className="value">{weather.main.feels_like}°C</span>
            </p>
            <p className="weather-item">
              <span className="label">Humidity:</span>
              <span className="value">{weather.main.humidity}%</span>
            </p>
            <p className="weather-item">
              <span className="label">Conditions:</span>
              <span className="value">{weather.weather[0].description}</span>
            </p>
            <p className="weather-item">
              <span className="label">Wind Speed:</span>
              <span className="value">{weather.wind.speed} m/s</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;