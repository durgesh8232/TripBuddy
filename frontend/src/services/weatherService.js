import axios from "axios";

export const getDestinationWeather = async (cityName) => {
  try {
    // 1. Geocode destination to lat/lon using Open-Meteo
    const geoRes = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );

    if (!geoRes.data.results || geoRes.data.results.length === 0) {
      return null;
    }

    const { latitude, longitude, name, admin1 } = geoRes.data.results[0];

    // 2. Fetch current weather and daily min/max
    const weatherRes = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    const current = weatherRes.data.current;
    const daily = weatherRes.data.daily;

    const interpretWeather = (code) => {
      if (code === 0) return { label: "Clear Sky", icon: "☀️", packTip: "Carry light breathable clothes & sunglasses" };
      if (code <= 3) return { label: "Partly Cloudy", icon: "⛅", packTip: "Mild pleasant weather; pack standard daywear" };
      if (code <= 48) return { label: "Foggy / Mist", icon: "🌫️", packTip: "Low morning visibility; pack light jackets" };
      if (code <= 67) return { label: "Rain Showers", icon: "🌧️", packTip: "Carry umbrellas & quick-dry footwear" };
      if (code <= 77) return { label: "Snow / Frost", icon: "❄️", packTip: "Pack heavy thermals, gloves & boots" };
      return { label: "Stormy / Rain", icon: "⛈️", packTip: "Pack rainproof gear & waterproof bags" };
    };

    const condition = interpretWeather(current.weather_code);

    return {
      cityName: name,
      region: admin1 || "",
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      tempMax: Math.round(daily.temperature_2m_max[0]),
      tempMin: Math.round(daily.temperature_2m_min[0]),
      ...condition,
    };
  } catch (err) {
    console.warn("Could not fetch weather data:", err);
    return null;
  }
};