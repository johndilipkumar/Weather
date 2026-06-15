import React, { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const WeatherContext = createContext();

const DEFAULT_LOCATION = {
  name: 'London',
  country: 'United Kingdom',
  latitude: 51.5074,
  longitude: -0.1278,
  countryCode: 'GB',
  admin1: 'England',
  timezone: 'Europe/London'
};

const DEFAULT_UNITS = {
  temperature: 'C',      // 'C' | 'F'
  windSpeed: 'kmh',      // 'kmh' | 'mph'
  precipitation: 'mm'   // 'mm' | 'inch'
};

export function WeatherProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useLocalStorage('skyflow_location', DEFAULT_LOCATION);
  const [units, setUnits] = useLocalStorage('skyflow_units', DEFAULT_UNITS);
  const [favorites, setFavorites] = useLocalStorage('skyflow_favorites', [DEFAULT_LOCATION]);
  const [searchHistory, setSearchHistory] = useLocalStorage('skyflow_history', []);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Update a single unit type
  const updateUnit = (key, val) => {
    setUnits(prev => ({ ...prev, [key]: val }));
  };

  // Add location to search history (max 8 entries, unique)
  const addToHistory = (location) => {
    setSearchHistory(prev => {
      const filtered = prev.filter(item => item.name !== location.name || item.country !== location.country);
      return [location, ...filtered].slice(0, 8);
    });
  };

  // Clear search history
  const clearHistory = () => {
    setSearchHistory([]);
  };

  // Toggle favorite location
  const toggleFavorite = (location) => {
    setFavorites(prev => {
      const isFav = prev.some(item => item.name === location.name && item.country === location.country);
      if (isFav) {
        return prev.filter(item => !(item.name === location.name && item.country === location.country));
      } else {
        return [...prev, location];
      }
    });
  };

  // Check if a location is in favorites
  const isFavorite = (location) => {
    if (!location) return false;
    return favorites.some(item => item.name === location.name && item.country === location.country);
  };

  // Unit conversion helpers (Open-Meteo returns metric by default)
  const convertTemp = (celsius) => {
    if (celsius === null || celsius === undefined) return null;
    return units.temperature === 'F' ? (celsius * 9) / 5 + 32 : celsius;
  };

  const formatTemp = (celsius) => {
    const val = convertTemp(celsius);
    if (val === null) return '--';
    return `${Math.round(val)}°${units.temperature}`;
  };

  const convertWind = (kmh) => {
    if (kmh === null || kmh === undefined) return null;
    return units.windSpeed === 'mph' ? kmh * 0.621371 : kmh;
  };

  const formatWind = (kmh) => {
    const val = convertWind(kmh);
    if (val === null) return '--';
    return `${val.toFixed(1)} ${units.windSpeed === 'mph' ? 'mph' : 'km/h'}`;
  };

  const convertPrecip = (mm) => {
    if (mm === null || mm === undefined) return null;
    return units.precipitation === 'inch' ? mm * 0.0393701 : mm;
  };

  const formatPrecip = (mm) => {
    const val = convertPrecip(mm);
    if (val === null) return '--';
    return `${val.toFixed(2)} ${units.precipitation === 'inch' ? 'in' : 'mm'}`;
  };

  return (
    <WeatherContext.Provider
      value={{
        selectedLocation,
        setSelectedLocation: (loc) => {
          setSelectedLocation(loc);
          setSelectedDayIndex(0); // Reset hourly forecast to "today" on location change
        },
        units,
        updateUnit,
        favorites,
        toggleFavorite,
        isFavorite,
        searchHistory,
        addToHistory,
        clearHistory,
        selectedDayIndex,
        setSelectedDayIndex,
        // Conversion helpers
        convertTemp,
        formatTemp,
        convertWind,
        formatWind,
        convertPrecip,
        formatPrecip
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeatherContext must be used within a WeatherProvider');
  }
  return context;
}
