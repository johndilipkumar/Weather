import React from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { getWeatherDetails, getWeatherIconUrl } from '../utils/weatherUtils';
import { FiClock, FiMoon } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function HourlyForecast({ hourlyHours }) {
  const { formatTemp } = useWeatherContext();

  const getHourLabel = (timeStr) => {
    try {
      const date = new Date(timeStr);
      const hour = date.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${formattedHour} ${ampm}`;
    } catch (e) {
      return timeStr.split('T')[1]?.substring(0, 5) || timeStr;
    }
  };

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.015
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 120 } }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <FiClock className="w-4 h-4 text-brand-orange" />
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider font-display">
          24-Hour Forecast
        </h3>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex gap-3 overflow-x-auto custom-scrollbar pb-3 select-none"
      >
        {hourlyHours.map((hour, idx) => {
          const dateObj = new Date(hour.time);
          const hourNum = dateObj.getHours();
          const isHourDay = hourNum >= 6 && hourNum < 18; // approximate daylight hours
          
          const weather = getWeatherDetails(hour.weatherCode, isHourDay);
          const iconUrl = getWeatherIconUrl(weather.icon);
          const hourLabel = getHourLabel(hour.time);
          
          // Check if it is current hour to add a highlight
          const isCurrentHour = new Date().getHours() === hourNum && new Date().toDateString() === dateObj.toDateString();

          return (
            <motion.div
              key={hour.time}
              variants={itemVariants}
              whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.15)' }}
              className={`flex-shrink-0 w-20 py-3.5 px-2.5 rounded-2xl flex flex-col items-center justify-between border transition-all duration-300 ${
                isCurrentHour
                  ? 'bg-gradient-to-b from-brand-orange/25 to-transparent border-brand-orange/60 shadow-lg shadow-brand-orange/5'
                  : 'glass-card border-white/5'
              }`}
            >
              {/* Hour Label */}
              <span className={`text-[10px] font-bold font-display uppercase tracking-wider ${
                isCurrentHour ? 'text-brand-orange' : 'text-white/50'
              }`}>
                {hourLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-2.5 relative flex items-center justify-center">
                {weather.icon === 'night-icon' ? (
                  <FiMoon className="w-8 h-8 text-yellow-100 filter drop-shadow-[0_2px_4px_rgba(253,224,71,0.2)]" />
                ) : (
                  iconUrl && (
                    <img
                      src={iconUrl}
                      alt={weather.label}
                      className="w-9 h-9 object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                    />
                  )
                )}
              </div>

              {/* Temperature */}
              <span className="text-xs font-bold text-white tracking-tight">
                {formatTemp(hour.temperature)}
              </span>

              {/* Rain Chance percentage */}
              {hour.precipitationProbability > 0 ? (
                <span className="text-[9px] font-bold text-blue-400 mt-1">
                  ☔ {hour.precipitationProbability}%
                </span>
              ) : (
                <span className="text-[9px] font-medium text-white/20 mt-1">
                  --
                </span>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
