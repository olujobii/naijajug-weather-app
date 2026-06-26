import { useState } from "react";
import "../styles/App.css";
import SearchForm from "./SearchForm";
import LocationResults from "./LocationResults.jsx";
import WeatherDisplay from "./WeatherDisplay.jsx";
import "../styles/location.css";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

function App() {
  const [formInput, setFormInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    if (formInput.trim() === "") return;

    fetchLocationData();
  }

  async function fetchLocationData() {
    setLoading(true);
    setError("");
    setLocations([]);
    setWeather(null);

    try {
      const response = await fetch(`${GEOCODE_URL}?name=${formInput}&count=5`);

      if (response.status !== 200)
        throw new Error("Error fetching Location, try again later");
      const data = await response.json();

      console.log(response);
      console.log(data);

      //If results does not exists since API always returns 200, I had to do a manual error handling
      if (!data.results || data.results.length === 0)
        throw new Error("City not found");

      if (data.results.length > 1) {
        setLocations(data.results);
        return;
      }

      //If location is exactly one
      fetchWeatherData(
        `${data.results[0].name},${data.results[0].country}`,
        data.results[0].latitude,
        data.results[0].longitude,
      );
    } catch (error) {
      console.log(error);
      setError(`${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherData(locationName, latitude, longitude) {
    console.log("calling");
    setLoading(true);
    setError("");
    setLocations([]);
    setWeather(null);

    try {
      const response = await fetch(
        `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`,
      );

      if (response.status !== 200)
        throw new Error("Error fetching weather data, try again later");

      console.log(response);
      const data = await response.json();

      if (!data) throw new Error("Error getting weather data. Try again later");

      console.log(data);
      setWeather({
        time: data.current.time,
        temp: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        locationName,
        tempUnit: data.current_units.temperature_2m,
        windSpeedUnit: data.current_units.wind_speed_10m,
        humidityUnit: data.current_units.relative_humidity_2m,
      });
    } catch (error) {
      setError(`${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SearchForm
        formInput={formInput}
        setFormInput={setFormInput}
        onHandleSubmit={handleSubmit}
      />
      <main>
        {error && <p>{error}</p>}
        {loading && <p>Loading..... </p>}
        {locations.length > 0 && (
          <section className='location-grid-container'>
            {locations.map((location) => (
              <LocationResults
                key={location.id}
                location={location}
                onFetchWeatherData={fetchWeatherData}
              />
            ))}
          </section>
        )}
        {weather && <WeatherDisplay {...weather} />}
      </main>
    </>
  );
}

export default App;
