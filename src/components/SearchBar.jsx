import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherContext } from '../context/WeatherContext';
import { searchLocations } from '../api/geocodingApi';
import { FiSearch, FiX, FiClock, FiStar, FiLoader, FiHeart } from 'react-icons/fi';

export default function SearchBar() {
  const {
    selectedLocation,
    setSelectedLocation,
    favorites,
    toggleFavorite,
    isFavorite,
    searchHistory,
    addToHistory,
    clearHistory
  } = useWeatherContext();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced geocoding search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setErrorMsg(null);
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);
    const delayDebounce = setTimeout(async () => {
      try {
        const locations = await searchLocations(query);
        setResults(locations);
        if (locations.length === 0) {
          setErrorMsg(`No locations found for "${query}"`);
        }
      } catch (err) {
        setErrorMsg('Failed to fetch search results. Check your network.');
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (location) => {
    const formattedLoc = {
      name: location.name,
      country: location.country,
      latitude: location.latitude,
      longitude: location.longitude,
      countryCode: location.country_code,
      admin1: location.admin1,
      timezone: location.timezone
    };
    setSelectedLocation(formattedLoc);
    addToHistory(formattedLoc);
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) inputRef.current.blur();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    const items = query.trim().length >= 2 ? results : [...favorites, ...searchHistory];
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % items.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        handleSelect(items[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      if (inputRef.current) inputRef.current.blur();
    }
  };

  // Get flag emoji from country code
  const getFlagEmoji = (countryCode) => {
    if (!countryCode) return '';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const isCurrentFavorite = isFavorite(selectedLocation);

  return (
    <div className="relative w-full max-w-xl z-40" ref={containerRef}>
      {/* Search Input Container */}
      <div className="flex gap-2 w-full">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city (e.g. New York, Hyderabad, Tokyo)..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl glass-input text-white placeholder-white/40 focus:outline-none transition-all duration-300 font-medium"
            aria-label="City search input"
            aria-autocomplete="list"
            aria-controls="search-dropdown"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
            {isSearching ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <FiSearch className="w-5 h-5" />
            )}
          </div>
          {query && (
            <button
              onClick={() => {
                setQuery('');
                if (inputRef.current) inputRef.current.focus();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
              aria-label="Clear query text"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Favorite toggle for current selected location */}
        {selectedLocation && (
          <button
            onClick={() => toggleFavorite(selectedLocation)}
            className={`flex items-center justify-center p-3.5 rounded-2xl glass-card text-white transition-all duration-300 active:scale-95 border ${
              isCurrentFavorite
                ? 'border-red-500/50 bg-red-500/10 text-red-400 hover:text-red-300'
                : 'border-white/10 hover:border-white/30 text-white/70 hover:text-white'
            }`}
            aria-label={isCurrentFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <FiHeart className={`w-5 h-5 ${isCurrentFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="search-dropdown"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-3 glass-card rounded-2xl p-2.5 shadow-2xl overflow-hidden max-h-96 overflow-y-auto custom-scrollbar border border-white/10"
            role="listbox"
          >
            {/* Active search query results */}
            {query.trim().length >= 2 ? (
              <div>
                {isSearching && results.length === 0 && (
                  <div className="flex items-center justify-center py-6 text-white/50 text-sm gap-2">
                    <FiLoader className="w-4 h-4 animate-spin text-brand-orange" />
                    Searching for cities...
                  </div>
                )}
                {errorMsg && !isSearching && (
                  <div className="py-6 text-center text-white/40 text-sm">
                    {errorMsg}
                  </div>
                )}
                {results.map((loc, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={loc.id || `${loc.latitude}-${loc.longitude}`}
                      onClick={() => handleSelect(loc)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 border-l-4 border-blue-500 text-white'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                      role="option"
                      aria-selected={isActive}
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {loc.name}
                        </span>
                        <span className="text-xs text-white/40">
                          {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                        </span>
                      </div>
                      <span className="text-xl" title={loc.country}>
                        {getFlagEmoji(loc.country_code)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              /* Favorites & Recent Searches when query is empty */
              <div className="space-y-4">
                {/* Favorites list */}
                {favorites.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white/40 uppercase tracking-wider font-display">
                      <FiStar className="w-3.5 h-3.5 text-yellow-400" />
                      Favorite Locations
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {favorites.map((fav, idx) => {
                        const globalIdx = idx;
                        const isActive = globalIdx === activeIndex;
                        return (
                          <button
                            key={`${fav.latitude}-${fav.longitude}-${fav.name}`}
                            onClick={() => handleSelect(fav)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between transition-all duration-200 ${
                              isActive
                                ? 'bg-white/10 text-white'
                                : 'text-white/80 hover:bg-white/5 hover:text-white'
                            }`}
                            role="option"
                            aria-selected={isActive}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-xs">{fav.name}</span>
                              <span className="text-[10px] text-white/40">
                                {fav.admin1 ? `${fav.admin1}, ` : ''}{fav.country}
                              </span>
                            </div>
                            <span className="text-sm">{getFlagEmoji(fav.countryCode)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* History list */}
                {searchHistory.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between px-3 py-1.5">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-white/40 uppercase tracking-wider font-display">
                        <FiClock className="w-3.5 h-3.5" />
                        Recent Searches
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearHistory();
                        }}
                        className="text-[10px] font-bold text-red-400/70 hover:text-red-400 transition-colors uppercase tracking-wider"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="mt-1 space-y-0.5">
                      {searchHistory.map((hist, idx) => {
                        const globalIdx = favorites.length + idx;
                        const isActive = globalIdx === activeIndex;
                        return (
                          <button
                            key={`${hist.latitude}-${hist.longitude}-${hist.name}-${idx}`}
                            onClick={() => handleSelect(hist)}
                            className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center justify-between transition-all duration-200 ${
                              isActive
                                ? 'bg-white/10 text-white'
                                : 'text-white/80 hover:bg-white/5 hover:text-white'
                            }`}
                            role="option"
                            aria-selected={isActive}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-xs">{hist.name}</span>
                              <span className="text-[10px] text-white/40">
                                {hist.admin1 ? `${hist.admin1}, ` : ''}{hist.country}
                              </span>
                            </div>
                            <span className="text-sm">{getFlagEmoji(hist.countryCode)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  favorites.length === 0 && (
                    <div className="py-6 text-center text-white/30 text-xs">
                      Type a city name to search...
                    </div>
                  )
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
