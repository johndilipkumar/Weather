import React from 'react';
import useWeather from '../hooks/useWeather';
import useForecast from '../hooks/useForecast';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import WeatherMetrics from '../components/WeatherMetrics';
import Forecast7Day from '../components/Forecast7Day';
import HourlyForecast from '../components/HourlyForecast';
import WeatherChart from '../components/WeatherChart';
import Favorites from '../components/Favorites';
import UnitSelector from '../components/UnitSelector';
import WeatherBackground from '../components/WeatherBackground';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { motion } from 'framer-motion';

export default function Home() {
  const { weatherData, isLoading, error, refetch } = useWeather();
  const { selectedDayHours } = useForecast(weatherData);

  // Logo asset resolution
  const logoUrl = new URL('../assets/images/logo.svg', import.meta.url).href;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07080d] text-white py-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="min-h-screen bg-[#07080d] text-white py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-4">
          {/* Top Bar even on error so user can search another city */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <div className="flex items-center gap-2">
                <img src={logoUrl} alt="Skyflow Logo" className="h-6 md:h-8 object-contain" />
                <span className="font-display font-bold text-lg md:text-xl text-white tracking-tight">Skyflow</span>
              </div>
              <div className="sm:hidden">
                <UnitSelector />
              </div>
            </div>
            <div className="w-full sm:flex-1 sm:max-w-xl">
              <SearchBar />
            </div>
            <div className="hidden sm:block">
              <UnitSelector />
            </div>
          </header>
          <ErrorState message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  const { current } = weatherData;

  return (
    <div className="min-h-screen text-white relative pb-12">
      {/* Canvas backdrop */}
      <WeatherBackground weatherCode={current.weatherCode} isDay={current.isDay} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 relative z-10">
        
        {/* Navigation / Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full"
        >
          <div className="flex items-center justify-between w-full sm:w-auto select-none">
            <div className="flex items-center gap-2">
              {logoUrl && <img src={logoUrl} alt="Skyflow Logo" className="h-6 md:h-8 object-contain filter drop-shadow-md" />}
              <span className="font-display font-bold text-lg md:text-xl text-white tracking-tight">
                Skyflow
              </span>
            </div>
            <div className="sm:hidden">
              <UnitSelector />
            </div>
          </div>
          
          <div className="w-full sm:flex-1 sm:max-w-xl">
            <SearchBar />
          </div>
          
          <div className="hidden sm:block">
            <UnitSelector />
          </div>
        </motion.header>

        {/* Favorites list pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          <Favorites />
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
          
          {/* Left Column: Current Weather summary */}
          <div className="lg:col-span-4 h-full">
            <CurrentWeather currentData={current} />
          </div>

          {/* Right Column: In-depth metrics cards */}
          <div className="lg:col-span-8 flex flex-col gap-6 h-full justify-between">
            <WeatherMetrics currentData={current} />
          </div>

        </div>

        {/* Mid section: 7-Day Forecast picker */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <Forecast7Day dailyData={weatherData.daily} />
        </motion.section>

        {/* Bottom Section: Hourly Scroller & Trends Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          
          {/* Hourly deck */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-6 glass-card rounded-3xl p-5 md:p-6 border border-white/5 flex flex-col justify-between"
          >
            <HourlyForecast hourlyHours={selectedDayHours} />
          </motion.div>

          {/* Graphical Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="lg:col-span-6"
          >
            <WeatherChart hourlyHours={selectedDayHours} />
          </motion.div>

        </div>

      </div>
    </div>
  );
}
