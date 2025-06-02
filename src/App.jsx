import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

  

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Fetch current weather
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!currentRes.ok) throw new Error("City not found (Current)");

      const currentData = await currentRes.json();

      setWeather({
        temp: Math.round(currentData.main.temp),
        humidity: currentData.main.humidity,
        city: currentData.name,
        condition: currentData.weather[0].main,
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
      });

      // 2. Fetch 5-day forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!forecastRes.ok) throw new Error("City not found (Forecast)");

      const forecastData = await forecastRes.json();

      const filteredForecast = forecastData.list
        .filter(item => item.dt_txt.includes("12:00:00"))
        .slice(0, 5); // 5 days

      setForecast(filteredForecast);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>☀️ React Weather App</h1>

      <div className="search-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={getWeather}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather">
          <h2>{weather.city}</h2>
          <div className="temp">{weather.temp}°C</div>
          <div>Humidity: {weather.humidity}%</div>
          <div>
            Condition: {weather.condition} ({weather.description})
          </div>
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
          />
        </div>
      )}

      {forecast.length > 0 && (
        <div className="forecast">
          <h2>5-Day Forecast</h2>
          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />
                <p>{Math.round(day.main.temp)}°C</p>
                <p>{day.weather[0].main}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
