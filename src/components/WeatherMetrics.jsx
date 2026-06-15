import React from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { getWindDirectionLabel, getUvIndexDescription } from '../utils/weatherUtils';
import { motion } from 'framer-motion';
import {
  FiThermometer,
  FiDroplet,
  FiWind,
  FiEye,
  FiSun,
  FiCompass,
  FiDownloadCloud,
  FiActivity
} from 'react-icons/fi';

export default function WeatherMetrics({ currentData }) {
  const { formatTemp, formatWind, formatPrecip } = useWeatherContext();

  const {
    apparentTemperature,
    humidity,
    windSpeed,
    windDirection,
    visibility,
    uvIndex,
    pressure,
    precipitation
  } = currentData;

  const metrics = [
    {
      title: 'Feels Like',
      value: formatTemp(apparentTemperature),
      icon: <FiThermometer className="w-5 h-5 text-red-400" />,
      detail: 'Similar to the air temperature',
      animDelay: 0.1
    },
    {
      title: 'Humidity',
      value: `${humidity}%`,
      icon: <FiDroplet className="w-5 h-5 text-blue-400" />,
      detail: `${humidity > 60 ? 'Humid' : humidity < 30 ? 'Dry' : 'Comfortable'} air`,
      widget: (
        <div className="w-full bg-white/10 rounded-full h-1.5 mt-3 overflow-hidden">
          <div
            className="bg-blue-400 h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${humidity}%` }}
          />
        </div>
      ),
      animDelay: 0.15
    },
    {
      title: 'Wind Speed',
      value: formatWind(windSpeed),
      icon: <FiWind className="w-5 h-5 text-teal-400" />,
      detail: `Direction: ${getWindDirectionLabel(windDirection)}`,
      animDelay: 0.2
    },
    {
      title: 'Wind Direction',
      value: `${windDirection}°`,
      icon: <FiCompass className="w-5 h-5 text-indigo-400" />,
      detail: getWindDirectionLabel(windDirection),
      widget: (
        <div className="mt-3 flex items-center justify-center">
          <div className="relative w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            {/* Compass Card Points */}
            <span className="absolute top-0.5 text-[6px] font-bold text-white/40">N</span>
            <span className="absolute bottom-0.5 text-[6px] font-bold text-white/40">S</span>
            {/* Rotating Arrow Needle */}
            <div
              className="w-1.5 h-6 bg-gradient-to-t from-transparent via-brand-orange to-brand-orange rounded-full transition-transform duration-1000"
              style={{ transform: `rotate(${windDirection}deg)` }}
            />
          </div>
        </div>
      ),
      animDelay: 0.25
    },
    {
      title: 'UV Index',
      value: uvIndex.toFixed(1),
      icon: <FiSun className="w-5 h-5 text-amber-400" />,
      detail: `${getUvIndexDescription(uvIndex)} Risk`,
      widget: (
        <div className="flex gap-1.5 mt-3 items-center">
          <span className={`w-2.5 h-2.5 rounded-full ${
            uvIndex <= 2 ? 'bg-green-500' : uvIndex <= 5 ? 'bg-yellow-500' : uvIndex <= 7 ? 'bg-orange-500' : 'bg-red-500'
          }`} />
          <span className="text-[10px] text-white/50">Sun protection {uvIndex > 2 ? 'recommended' : 'optional'}</span>
        </div>
      ),
      animDelay: 0.3
    },
    {
      title: 'Visibility',
      value: `${visibility.toFixed(1)} km`,
      icon: <FiEye className="w-5 h-5 text-sky-400" />,
      detail: visibility > 8 ? 'Perfect view' : visibility > 3 ? 'Moderate haze' : 'Poor visibility',
      animDelay: 0.35
    },
    {
      title: 'Precipitation',
      value: formatPrecip(precipitation),
      icon: <FiDownloadCloud className="w-5 h-5 text-purple-400" />,
      detail: precipitation > 0 ? 'Rain/snow detected' : 'No rainfall today',
      animDelay: 0.4
    },
    {
      title: 'Pressure',
      value: `${Math.round(pressure)} hPa`,
      icon: <FiActivity className="w-5 h-5 text-emerald-400" />,
      detail: pressure > 1013 ? 'High pressure area' : 'Low pressure area',
      animDelay: 0.45
    }
  ];

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
    >
      {metrics.map((metric) => (
        <motion.div
          key={metric.title}
          variants={itemVariants}
          whileHover={{ y: -4, borderColor: 'rgba(255, 255, 255, 0.15)' }}
          className="glass-card rounded-2xl p-4 flex flex-col justify-between border border-white/5 transition-all duration-300 relative group overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider font-display">
              {metric.title}
            </span>
            <div className="p-1.5 bg-white/5 rounded-lg">
              {metric.icon}
            </div>
          </div>

          <div className="mt-3.5">
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {metric.value}
            </span>
            <p className="text-[10px] text-white/40 font-medium mt-1 truncate">
              {metric.detail}
            </p>
            {metric.widget && metric.widget}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
