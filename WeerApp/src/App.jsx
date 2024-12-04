import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_KEY = "d32c705b4eb2b0eebb2bccbb0d23d3d2";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("Amsterdam");
  const [inputCity, setInputCity] = useState("");
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (city) {
      fetchWeather(city);
      fetchForecast(city);
    }
  }, [city]);

  const fetchWeather = async (city) => {
    try {
      setError("");
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Stad niet gevonden. Controleer de spelling en probeer opnieuw.");
      } else {
        setError("Er is een fout opgetreden bij het ophalen van gegevens.");
      }
    }
  };

  const fetchForecast = async (city) => {
    try {
      setError("");
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const filteredForecast = response.data.list.filter((item) =>
        item.dt_txt.endsWith("12:00:00")
      );
      setForecast(filteredForecast);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Kan de weersvoorspelling niet vinden voor deze stad.");
      } else {
        setError("Er is een fout opgetreden bij het ophalen van gegevens.");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedCity = inputCity.trim();
    if (!trimmedCity) {
      setError("Voer een geldige stadsnaam in.");
      return;
    }
    setCity(trimmedCity);
    setInputCity("");
  };

  const handleSetFavorite = () => {
    if (city.trim() !== "" && !favoriteCities.includes(city)) {
      setFavoriteCities((prevCities) => [...prevCities, city]);
      setError(""); // Reset eventuele foutmeldingen
    } else if (favoriteCities.includes(city)) {
      setError("Deze stad is al toegevoegd aan je favorieten.");
    } else {
      setError("Geen stad om in te stellen als favoriet.");
    }
  };

  const handleLoadFavorite = (city) => {
    setCity(city);
    setInputCity("");
  };

  return (
    <div className="App">
      <header>
        <h1>Weer App</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Voer een stad in..."
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)}
          />
          <button type="submit">Zoeken</button>
        </form>
        <button onClick={handleSetFavorite}>Stel in als Favoriet</button>
      </header>

      {error && <p className="error">{error}</p>}

      <div className="favorite-cities">
        <h2>Favoriete Steden</h2>
        {favoriteCities.length > 0 ? (
          <ul>
            {favoriteCities.map((favCity, index) => (
              <li key={index}>
                {favCity} <button onClick={() => handleLoadFavorite(favCity)}>Laad</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Geen favoriete steden toegevoegd.</p>
        )}
      </div>

      {weather && !error && (
        <div className="current-weather">
          <h2>{weather.name}</h2>
          <p>Temperatuur: {weather.main.temp} °C</p>
          <p>Weersomstandigheden: {weather.weather[0].description}</p>
          <p>Windsnelheid: {weather.wind.speed} m/s</p>
          <p>Luchtvochtigheid: {weather.main.humidity}%</p>
        </div>
      )}

      <div className="forecast">
        <h2>5-daagse voorspelling</h2>
        <div className="forecast-cards">
          {forecast.map((day) => (
            <div key={day.dt} className="forecast-card">
              <p>{new Date(day.dt_txt).toLocaleDateString()}</p>
              <p>Temperatuur: {day.main.temp} °C</p>
              <p>Weersomstandigheden: {day.weather[0].description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;