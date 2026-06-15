import React, { useEffect, useState } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { getWeatherDetails, getWeatherIconUrl } from '../utils/weatherUtils';
import { FiMoon, FiCalendar, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function CurrentWeather({ currentData }) {
  const { selectedLocation, formatTemp } = useWeatherContext();
  const [localTime, setLocalTime] = useState('');
  const [localDate, setLocalDate] = useState('');

  const { temperature, weatherCode, isDay } = currentData;
  const weather = getWeatherDetails(weatherCode, isDay);

  // Keep local time ticking
  useEffect(() => {
    const updateTime = () => {
      if (!selectedLocation?.timezone) return;
      try {
        const timeOptions = {
          timeZone: selectedLocation.timezone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        };
        const dateOptions = {
          timeZone: selectedLocation.timezone,
          weekday: 'long',
          day: 'numeric',
          month: 'short'
        };

        setLocalTime(new Date().toLocaleTimeString([], timeOptions));
        setLocalDate(new Date().toLocaleDateString([], dateOptions));
      } catch (err) {
        setLocalTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setLocalDate(new Date().toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'short' }));
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 30000); // Update every 30 seconds
    return () => clearInterval(timer);
  }, [selectedLocation]);

  const resolvedIconUrl = getWeatherIconUrl(weather.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full relative overflow-hidden"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Date & Time Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4 mb-6 text-sm text-white/60">
        <div className="flex items-center gap-1.5 font-medium">
          <FiCalendar className="w-4 h-4 text-brand-orange" />
          <span>{localDate || '--'}</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium bg-white/5 px-2.5 py-1 rounded-full">
          <FiClock className="w-4 h-4 text-brand-blue" />
          <span>{localTime || '--'}</span>
        </div>
      </div>

      {/* Main Temp & Icon Segment */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <motion.h2
            key={temperature} // Animate text changes
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl md:text-7xl font-bold font-display text-white tracking-tighter"
          >
            {formatTemp(temperature)}
          </motion.h2>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-bold text-white capitalize font-display">
              {weather.label}
            </span>
            <span className="text-sm text-white/50">
              Feels like {formatTemp(currentData.apparentTemperature)}
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          {weather.icon === 'night-icon' ? (
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="p-3 bg-indigo-950/40 rounded-3xl border border-indigo-500/20 shadow-2xl relative"
            >
              <FiMoon className="w-24 h-24 text-yellow-200 filter drop-shadow-[0_0_20px_rgba(253,224,71,0.4)]" />
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              <div className="absolute bottom-5 left-4 w-1 h-1 bg-white rounded-full animate-pulse" />
            </motion.div>
          ) : (
            resolvedIconUrl && (
              <motion.img
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                src={resolvedIconUrl}
                alt={weather.label}
                className="w-28 h-28 object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)]"
              />
            )
          )}
        </div>
      </div>

      {/* Location Details Footer */}
      <div className="mt-8 border-t border-white/5 pt-5">
        <div className="flex flex-col">
          <span className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight">
            {selectedLocation.name}
          </span>
          <span className="text-sm font-semibold text-white/50 mt-0.5">
            {selectedLocation.admin1 ? `${selectedLocation.admin1}, ` : ''}
            {selectedLocation.country}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
