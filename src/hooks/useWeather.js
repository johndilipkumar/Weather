import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData } from '../api/weatherApi';
import { useWeatherContext } from '../context/WeatherContext';

export default function useWeather() {
  const { selectedLocation } = useWeatherContext();
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(async () => {
    if (!selectedLocation) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherData(
        selectedLocation.latitude,
        selectedLocation.longitude,
        selectedLocation.timezone
      );
      setWeatherData(data);
    } catch (err) {
      console.error('Failed to load weather data:', err);
      setError(
        err.message || 'Unable to fetch weather data. Please check your internet connection or try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    loadWeather();
  }, [loadWeather]);

  return {
    weatherData,
    isLoading,
    error,
    refetch: loadWeather
  };
}
