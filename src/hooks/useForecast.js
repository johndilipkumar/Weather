import { useMemo } from 'react';
import { useWeatherContext } from '../context/WeatherContext';

export default function useForecast(weatherData) {
  const { selectedDayIndex } = useWeatherContext();

  return useMemo(() => {
    if (!weatherData) {
      return {
        selectedDay: null,
        selectedDayHours: []
      };
    }

    const selectedDay = weatherData.daily[selectedDayIndex] || null;
    const selectedDayHours = weatherData.hourly[selectedDayIndex]?.hours || [];

    return {
      selectedDay,
      selectedDayHours
    };
  }, [weatherData, selectedDayIndex]);
}
