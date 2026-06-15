/**
 * Searches for locations matching a query using the Open-Meteo Geocoding API.
 * @param {string} query The search query (e.g. "London")
 * @returns {Promise<Array>} List of matching locations
 */
export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query.trim()
  )}&count=10&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Geocoding service error');
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching geocoding data:', error);
    throw error;
  }
}
