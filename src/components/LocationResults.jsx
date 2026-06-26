import "../styles/location.css";

function LocationResults({ location, onFetchWeatherData }) {
  return (
    <div className='location-container'>
      <div>
        <p>{location.name}</p>
        <p>{location.country}</p>
        <p>{location.timezone}</p>
      </div>

      <button
        onClick={() =>
          onFetchWeatherData(
            `${location.name},${location.country}`,
            location.latitude,
            location.longitude,
          )
        }
      >
        Select
      </button>
    </div>
  );
}

export default LocationResults;
