import React, { useMemo } from 'react';
import { getWeatherDetails } from '../utils/weatherUtils';

export default function WeatherBackground({ weatherCode, isDay = true }) {
  // Determine weather category
  const weatherDetails = useMemo(() => {
    return getWeatherDetails(weatherCode, isDay);
  }, [weatherCode, isDay]);

  const { category } = weatherDetails;

  // Generate procedural elements once per category change
  const overlays = useMemo(() => {
    if (category === 'rainy') {
      // Create rain drops
      return (
        <div className="rain-container">
          {Array.from({ length: 50 }).map((_, idx) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 1.5;
            const duration = 0.8 + Math.random() * 0.6;
            return (
              <div
                key={idx}
                className="rain-drop"
                style={{
                  left: `${left}%`,
                  top: `-60px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      );
    }

    if (category === 'snow') {
      // Create snowflakes
      return (
        <div className="snow-container">
          {Array.from({ length: 40 }).map((_, idx) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = 4 + Math.random() * 4;
            const size = 2 + Math.random() * 4;
            const opacity = 0.4 + Math.random() * 0.5;
            return (
              <div
                key={idx}
                className="snow-flake"
                style={{
                  left: `${left}%`,
                  top: `-10px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: opacity,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      );
    }

    if (category === 'night') {
      // Create stars
      return (
        <div className="stars-container">
          {Array.from({ length: 80 }).map((_, idx) => {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const size = 0.8 + Math.random() * 1.5;
            const delay = Math.random() * 4;
            const duration = 3 + Math.random() * 3;
            return (
              <div
                key={idx}
                className="star"
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size}px`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      );
    }

    if (category === 'storm') {
      // Create storm clouds + lightning overlay
      return (
        <>
          <div className="lightning-flash" />
          <div className="rain-container">
            {Array.from({ length: 60 }).map((_, idx) => {
              const left = Math.random() * 100;
              const delay = Math.random() * 1.2;
              const duration = 0.7 + Math.random() * 0.5;
              return (
                <div
                  key={idx}
                  className="rain-drop"
                  style={{
                    left: `${left}%`,
                    top: `-60px`,
                    animationDelay: `${delay}s`,
                    animationDuration: `${duration}s`,
                    background: 'linear-gradient(transparent, rgba(200, 220, 255, 0.3))',
                  }}
                />
              );
            })}
          </div>
        </>
      );
    }

    if (category === 'cloudy') {
      // Create moving cloud elements
      return (
        <div className="clouds-container">
          {Array.from({ length: 4 }).map((_, idx) => {
            const top = 10 + idx * 20 + Math.random() * 10;
            const size = 150 + Math.random() * 200;
            const duration = 80 + idx * 30 + Math.random() * 20;
            const delay = -Math.random() * 80;
            return (
              <div
                key={idx}
                className="cloud-layer"
                style={{
                  top: `${top}%`,
                  width: `${size}px`,
                  height: `${size / 2}px`,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      );
    }

    // Default sunny/clear category - maybe subtle ambient particles
    return null;
  }, [category]);

  // Determine gradient scheme
  const gradientClass = useMemo(() => {
    switch (category) {
      case 'sunny':
        return 'from-blue-600 via-sky-500 to-indigo-700';
      case 'cloudy':
        return 'from-slate-700 via-slate-600 to-slate-800';
      case 'rainy':
        return 'from-slate-900 via-slate-850 to-slate-950';
      case 'night':
        return 'from-neutral-950 via-zinc-900 to-indigo-950';
      case 'snow':
        return 'from-sky-950 via-slate-900 to-indigo-950';
      case 'storm':
        return 'from-neutral-950 via-neutral-900 to-zinc-900';
      default:
        return 'from-blue-600 via-sky-500 to-indigo-700';
    }
  }, [category]);

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-gradient-to-br ${gradientClass} transition-all duration-1000 ease-in-out -z-10`}
      aria-hidden="true"
    >
      {/* Visual texture overlay */}
      <div className="absolute inset-0 bg-noise bg-repeat opacity-[0.02] pointer-events-none" />
      {/* Light glow radial accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Weather effect animations */}
      {overlays}
    </div>
  );
}
