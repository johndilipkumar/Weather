/**
 * Maps WMO Weather Codes to descriptive labels, categories, and icon files.
 * Open-Meteo uses WMO weather codes (0-99).
 */

const WEATHER_MAPPINGS = {
  0: { label: 'Clear Sky', icon: 'icon-sunny.webp', category: 'sunny' },
  1: { label: 'Mainly Clear', icon: 'icon-partly-cloudy.webp', category: 'sunny' },
  2: { label: 'Partly Cloudy', icon: 'icon-partly-cloudy.webp', category: 'cloudy' },
  3: { label: 'Overcast', icon: 'icon-overcast.webp', category: 'cloudy' },
  45: { label: 'Foggy', icon: 'icon-fog.webp', category: 'cloudy' },
  48: { label: 'Depositing Rime Fog', icon: 'icon-fog.webp', category: 'cloudy' },
  51: { label: 'Light Drizzle', icon: 'icon-drizzle.webp', category: 'rainy' },
  53: { label: 'Moderate Drizzle', icon: 'icon-drizzle.webp', category: 'rainy' },
  55: { label: 'Dense Drizzle', icon: 'icon-drizzle.webp', category: 'rainy' },
  56: { label: 'Light Freezing Drizzle', icon: 'icon-drizzle.webp', category: 'rainy' },
  57: { label: 'Dense Freezing Drizzle', icon: 'icon-drizzle.webp', category: 'rainy' },
  61: { label: 'Slight Rain', icon: 'icon-rain.webp', category: 'rainy' },
  63: { label: 'Moderate Rain', icon: 'icon-rain.webp', category: 'rainy' },
  65: { label: 'Heavy Rain', icon: 'icon-rain.webp', category: 'rainy' },
  66: { label: 'Light Freezing Rain', icon: 'icon-rain.webp', category: 'rainy' },
  67: { label: 'Heavy Freezing Rain', icon: 'icon-rain.webp', category: 'rainy' },
  71: { label: 'Slight Snowfall', icon: 'icon-snow.webp', category: 'snow' },
  73: { label: 'Moderate Snowfall', icon: 'icon-snow.webp', category: 'snow' },
  75: { label: 'Heavy Snowfall', icon: 'icon-snow.webp', category: 'snow' },
  77: { label: 'Snow Grains', icon: 'icon-snow.webp', category: 'snow' },
  80: { label: 'Slight Rain Showers', icon: 'icon-rain.webp', category: 'rainy' },
  81: { label: 'Moderate Rain Showers', icon: 'icon-rain.webp', category: 'rainy' },
  82: { label: 'Violent Rain Showers', icon: 'icon-rain.webp', category: 'rainy' },
  85: { label: 'Slight Snow Showers', icon: 'icon-snow.webp', category: 'snow' },
  86: { label: 'Heavy Snow Showers', icon: 'icon-snow.webp', category: 'snow' },
  95: { label: 'Thunderstorm', icon: 'icon-storm.webp', category: 'storm' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'icon-storm.webp', category: 'storm' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: 'icon-storm.webp', category: 'storm' }
};

/**
 * Gets details for a weather code.
 * Supports handling of night mode for clear/partly cloudy skies.
 */
export function getWeatherDetails(code, isDay = true) {
  const info = WEATHER_MAPPINGS[code] || {
    label: 'Unknown',
    icon: 'icon-sunny.webp',
    category: 'sunny'
  };

  // If it's night and the weather is sunny/partly cloudy, transition to night mode
  if (!isDay && (code === 0 || code === 1)) {
    return {
      label: code === 0 ? 'Clear Night' : 'Mostly Clear Night',
      icon: 'night-icon', // Handled via React Icons WiMoon or similar
      category: 'night'
    };
  }

  // Handle other nights (e.g. cloudy night, rainy night) - keep category/icon but flag it is night
  const category = isDay ? info.category : (info.category === 'sunny' ? 'night' : info.category);

  return {
    label: info.label,
    icon: info.icon,
    category
  };
}

/**
 * Resolves a Vite asset URL for the given weather icon filename.
 */
export function getWeatherIconUrl(iconName) {
  if (!iconName || iconName === 'night-icon') return null;
  return new URL(`../assets/images/${iconName}`, import.meta.url).href;
}

/**
 * Maps wind direction degree (0-360) to a compass direction label.
 */
export function getWindDirectionLabel(degree) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degree / 22.5) % 16;
  return directions[index];
}

/**
 * Formats a ISO 8601 date string to a short day name (e.g., "Mon").
 */
export function formatDayName(dateStr, locale = 'en-US') {
  const date = new Date(dateStr + 'T00:00:00'); // append time to avoid timezone shift
  return date.toLocaleDateString(locale, { weekday: 'short' });
}

/**
 * Formats an ISO 8601 time string to a readable format (e.g., "14:00" or "2 PM").
 */
export function formatTimeLabel(timeStr, locale = 'en-US') {
  const date = new Date(timeStr);
  return date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Gets a descriptive UV Index risk statement.
 */
export function getUvIndexDescription(uv) {
  if (uv <= 2) return 'Low';
  if (uv <= 5) return 'Moderate';
  if (uv <= 7) return 'High';
  if (uv <= 10) return 'Very High';
  return 'Extreme';
}
