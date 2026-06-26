import "../styles/location.css";

function LocationResults({ location }) {
  return (
    <div className='location-container'>
      <div>
        <p>{location.name}</p>
        <p>{location.country}</p>
        <p>{location.timezone}</p>
      </div>

      <button>Select</button>
    </div>
  );
}

export default LocationResults;
