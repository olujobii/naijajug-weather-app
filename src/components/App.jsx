import { useState } from "react";
import "../styles/App.css";
import SearchForm from "./SearchForm";
import LocationResults from "./LocationResults.jsx";
import "../styles/location.css";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

function App() {
  const [formInput, setFormInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    if (formInput.trim() === "") return;

    setLoading(true);
    setError("");
    setLocations([]);
    setWeather({});

    fetchLocationData();
  }

  async function fetchLocationData() {
    try {
      const response = await fetch(`${GEOCODE_URL}?name=${formInput}&count=5`);

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
      fetchWeatherData(data.results[0].latitude, data.results[0].longitude);
    } catch (error) {
      console.log(error);
      setError(`${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWeatherData(latitude, longitude) {
    setLoading(true);
    setError("");
    setLocations([]);
    setWeather({});

    try {
      const weatherResponse = await fetch(
        `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`,
      );

      const weatherData = await weatherResponse.json();
      console.log(weatherResponse);
      console.log(weatherData);
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
              <LocationResults key={location.id} location={location} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

export default App;
