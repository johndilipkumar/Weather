import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherContext } from '../context/WeatherContext';
import { FiSettings, FiCheck } from 'react-icons/fi';

export default function UnitSelector() {
  const { units, updateUnit } = useWeatherContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOpen = () => setIsOpen(prev => !isOpen);

  const unitConfigs = [
    {
      title: 'Temperature',
      key: 'temperature',
      options: [
        { label: 'Celsius (°C)', value: 'C' },
        { label: 'Fahrenheit (°F)', value: 'F' }
      ]
    },
    {
      title: 'Wind Speed',
      key: 'windSpeed',
      options: [
        { label: 'km/h', value: 'kmh' },
        { label: 'mph', value: 'mph' }
      ]
    },
    {
      title: 'Precipitation',
      key: 'precipitation',
      options: [
        { label: 'Millimeters (mm)', value: 'mm' },
        { label: 'Inches (in)', value: 'inch' }
      ]
    }
  ];

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleOpen}
        className="flex items-center justify-center p-3 rounded-xl glass-card text-white hover:text-brand-orange hover:border-brand-orange/50 transition-all duration-300 active:scale-95"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Customize units settings"
      >
        <FiSettings className={`w-5 h-5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-64 glass-card rounded-2xl p-4 shadow-2xl border border-white/10 z-[60]"
            role="menu"
            aria-label="Unit preferences menu"
          >
            <h3 className="text-sm font-bold text-white/40 mb-3 uppercase tracking-wider font-display">Unit System</h3>

            <div className="space-y-4">
              {unitConfigs.map((config) => (
                <div key={config.key} className="space-y-1.5">
                  <span className="text-xs font-semibold text-white/50">{config.title}</span>
                  <div className="grid grid-cols-2 gap-1 bg-white/5 p-1 rounded-xl">
                    {config.options.map((opt) => {
                      const isSelected = units[config.key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => updateUnit(config.key, opt.value)}
                          className={`relative py-1.5 px-2 text-xs font-medium rounded-lg transition-all duration-300 text-center flex items-center justify-center gap-1 ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                              : 'text-white/70 hover:text-white hover:bg-white/5'
                          }`}
                          role="menuitemradio"
                          aria-checked={isSelected}
                        >
                          {opt.label.split(' ')[0]}
                          {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
