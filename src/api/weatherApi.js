/**
 * Fetches weather data for a given location.
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} timezone (default: 'auto')
 * @returns {Promise<Object>} Formatted weather data
 */
export async function fetchWeatherData(latitude, longitude, timezone = 'auto') {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'pressure_msl',
      'uv_index',
      'visibility'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'precipitation_probability',
      'weather_code'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'precipitation_sum',
      'wind_speed_10m_max',
      'wind_direction_10m_dominant',
      'uv_index_max'
    ].join(','),
    timezone: timezone
  });

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Weather API service error');
    }
    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Formats the raw Open-Meteo response into a structured dashboard-friendly format.
 */
function formatWeatherData(data) {
  const current = {
    time: data.current.time,
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    apparentTemperature: data.current.apparent_temperature,
    isDay: data.current.is_day === 1,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    pressure: data.current.pressure_msl,
    uvIndex: data.current.uv_index,
    visibility: data.current.visibility / 1000 // Convert m to km
  };

  // Build daily forecast array (7 items)
  const daily = data.daily.time.map((dateStr, index) => {
    return {
      date: dateStr,
      weatherCode: data.daily.weather_code[index],
      tempMax: data.daily.temperature_2m_max[index],
      tempMin: data.daily.temperature_2m_min[index],
      apparentMax: data.daily.apparent_temperature_max[index],
      apparentMin: data.daily.apparent_temperature_min[index],
      precipitationSum: data.daily.precipitation_sum[index],
      windSpeedMax: data.daily.wind_speed_10m_max[index],
      windDirectionDominant: data.daily.wind_direction_10m_dominant[index],
      uvIndexMax: data.daily.uv_index_max[index]
    };
  });

  // Group 168 hours into 7 days of 24 hourly periods
  const hourly = daily.map((day, dayIndex) => {
    const startIndex = dayIndex * 24;
    const dayHours = [];

    for (let i = 0; i < 24; i++) {
      const idx = startIndex + i;
      dayHours.push({
        time: data.hourly.time[idx],
        temperature: data.hourly.temperature_2m[idx],
        humidity: data.hourly.relative_humidity_2m[idx],
        precipitationProbability: data.hourly.precipitation_probability[idx],
        weatherCode: data.hourly.weather_code[idx]
      });
    }

    return {
      date: day.date,
      hours: dayHours
    };
  });

  return {
    timezone: data.timezone,
    current,
    daily,
    hourly
  };
}
