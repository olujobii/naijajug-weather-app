import { useState } from "react";
import "../styles/App.css";
import SearchForm from "./SearchForm";
import LocationResults from "./LocationResults.jsx";

const GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

function App() {
  const [formInput, setFormInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState([]);
  const [weather, setWeather] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    if (formInput.trim() === "") return;

    setLoading(true);
    setError("");
    setLocation([]);
    setWeather({});

    try {
      const response = await fetch(`${GEOCODE_URL}?name=${formInput}&count=5`);

      const data = await response.json();

      console.log(response);
      console.log(data);

      //If results does not exists since API always returns 200, I had to do a manual error handling
      if (!data.results || data.results.length === 0)
        throw new Error("Location does not exist");

      if (data.results.length > 1) {
        setLocation([data.results]);
        return;
      }

      //If location is exactly one

      const weatherResponse = await fetch(
        `${WEATHER_URL}?latitude=${data.results[0].latitude}&longitude=${data.results[0].longitude}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`,
      );

      const weatherData = await weatherResponse.json();
      console.log(weatherResponse);
      console.log(weatherData);
    } catch (error) {
      console.log(error);
      setError("Error occured: ", error);
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
        {loading && <p>Loading..... </p>}
        {location.length > 0 && <LocationResults location={location} />}
      </main>
    </>
  );
}

export default App;
