import "../styles/weather.css";

function WeatherDisplay({
  time,
  temp,
  humidity,
  windSpeed,
  locationName,
  tempUnit,
  windSpeedUnit,
  humidityUnit,
}) {
  return (
    <div className='weather-container'>
      <p>{locationName}</p>
      <p>
        Temperature: {temp}
        {tempUnit}
      </p>
      <p>
        Wind Speed: {windSpeed}
        {windSpeedUnit}
      </p>
      <p>
        Humidity: {humidity}
        {humidityUnit}
      </p>
      <p>
        Time of Reading:{" "}
        {new Date(time).toLocaleString("en-US", {
          dateStyle: "medium",
          timeStyle: "medium",
        })}
      </p>
    </div>
  );
}

export default WeatherDisplay;
