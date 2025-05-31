import React, { useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_KEY = "67e886ec0dd7af165f818f8e9b7e132c";

  const getWeather = async () => {
    if (!city) {
      setError("Please enter a city");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error("City not found!");
      }

      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        city: data.name,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>☀️ React Weather App</h1>

      <div className="search">
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
        </div>
      )}
    </div>
  );
}

export default App;
