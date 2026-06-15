import React from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { FiHeart, FiX, FiMapPin } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

export default function Favorites() {
  const { favorites, setSelectedLocation, toggleFavorite, selectedLocation } = useWeatherContext();

  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return '';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  if (favorites.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-bold text-white/40 uppercase tracking-wider font-display">
        <FiHeart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
        <span>Favorites</span>
      </div>

      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto no-scrollbar py-1">
        <AnimatePresence>
          {favorites.map((fav) => {
            const isSelected = selectedLocation && selectedLocation.name === fav.name && selectedLocation.country === fav.country;

            return (
              <motion.div
                key={`${fav.latitude}-${fav.longitude}-${fav.name}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={`group flex items-center gap-2 pl-3.5 pr-2.5 py-1.5 rounded-full border transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-blue-500 text-white font-semibold'
                    : 'glass-card border-white/5 hover:border-white/20 text-white/70 hover:text-white'
                }`}
              >
                <button
                  onClick={() => setSelectedLocation(fav)}
                  className="flex items-center gap-1.5 text-xs select-none focus:outline-none"
                  aria-label={`Switch location to ${fav.name}, ${fav.country}`}
                >
                  <FiMapPin className={`w-3 h-3 ${isSelected ? 'text-blue-400' : 'text-white/40'}`} />
                  <span>{fav.name}</span>
                  <span className="text-sm">{getFlagEmoji(fav.countryCode)}</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(fav);
                  }}
                  className="p-0.5 rounded-full text-white/30 hover:text-red-400 hover:bg-white/10 transition-all duration-200"
                  aria-label={`Remove ${fav.name} from favorites`}
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
