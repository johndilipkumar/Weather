import React from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { getWeatherDetails, getWeatherIconUrl, formatDayName } from '../utils/weatherUtils';
import { motion } from 'framer-motion';

export default function Forecast7Day({ dailyData }) {
  const { selectedDayIndex, setSelectedDayIndex, formatTemp } = useWeatherContext();

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.04
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider font-display mb-4">
        7-Day Forecast
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex lg:grid lg:grid-cols-7 gap-3 overflow-x-auto no-scrollbar py-2 -my-2 select-none"
      >
        {dailyData.map((day, idx) => {
          const isSelected = idx === selectedDayIndex;
          const weather = getWeatherDetails(day.weatherCode, true);
          const iconUrl = getWeatherIconUrl(weather.icon);
          const dayName = idx === 0 ? 'Today' : formatDayName(day.date);

          return (
            <motion.button
              key={day.date}
              variants={itemVariants}
              onClick={() => setSelectedDayIndex(idx)}
              className={`flex-shrink-0 w-28 lg:w-full py-4 px-3 rounded-2xl flex flex-col items-center justify-between transition-all duration-300 border focus:outline-none ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-600/30 to-indigo-600/30 border-blue-500/80 shadow-lg shadow-blue-500/10 scale-[1.02]'
                  : 'glass-card glass-card-hover border-white/5 hover:scale-[1.01]'
              }`}
              role="tab"
              aria-selected={isSelected}
              aria-label={`Forecast for ${dayName}: ${weather.label}`}
            >
              {/* Day Label */}
              <span className={`text-xs font-bold font-display uppercase tracking-wide transition-colors ${
                isSelected ? 'text-white' : 'text-white/60'
              }`}>
                {dayName}
              </span>

              {/* Weather Icon */}
              <div className="my-3.5 relative flex items-center justify-center">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={weather.label}
                    className="w-12 h-12 object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-xl">☀️</span>
                )}
                {isSelected && (
                  <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl filter -z-10" />
                )}
              </div>

              {/* Temperatures */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-bold text-white tracking-tight">
                  {formatTemp(day.tempMax)}
                </span>
                <span className="text-[11px] font-medium text-white/40 mt-0.5 tracking-tight">
                  {formatTemp(day.tempMin)}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
