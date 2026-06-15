import React, { useState, useMemo } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { FiThermometer, FiDroplet, FiCloudRain } from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

export default function WeatherChart({ hourlyHours }) {
  const { convertTemp, units } = useWeatherContext();
  const [activeTab, setActiveTab] = useState('temp'); // 'temp' | 'rain' | 'humidity'

  // Format the time label for the X axis (e.g. "2 PM")
  const getShortHourLabel = (timeStr) => {
    try {
      const date = new Date(timeStr);
      const hour = date.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return `${formattedHour}${ampm.toLowerCase()}`;
    } catch (e) {
      return timeStr.split('T')[1]?.substring(0, 2) || timeStr;
    }
  };

  // Process data for Recharts
  const chartData = useMemo(() => {
    return hourlyHours.map(hour => ({
      name: getShortHourLabel(hour.time),
      temp: Math.round(convertTemp(hour.temperature)),
      rain: hour.precipitationProbability,
      humidity: hour.humidity
    }));
  }, [hourlyHours, convertTemp]);

  const activeConfig = useMemo(() => {
    switch (activeTab) {
      case 'temp':
        return {
          dataKey: 'temp',
          strokeColor: '#f97316', // brand-orange / orange-500
          fillColorId: 'colorTemp',
          unit: `°${units.temperature}`,
          title: 'Temperature Trend'
        };
      case 'rain':
        return {
          dataKey: 'rain',
          strokeColor: '#3b82f6', // blue-500
          fillColorId: 'colorRain',
          unit: '%',
          title: 'Precipitation Probability'
        };
      case 'humidity':
        return {
          dataKey: 'humidity',
          strokeColor: '#10b981', // emerald-500
          fillColorId: 'colorHumidity',
          unit: '%',
          title: 'Humidity Levels'
        };
      default:
        return {};
    }
  }, [activeTab, units.temperature]);

  // Custom Glassmorphic Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card rounded-xl p-3 border border-white/10 text-xs shadow-xl backdrop-blur-md">
          <p className="font-semibold text-white/50 mb-1">{label}</p>
          <p className="font-bold text-white text-sm">
            {payload[0].value}
            {activeConfig.unit}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-3xl p-5 md:p-6 border border-white/5 flex flex-col h-[320px] md:h-[350px]">
      {/* Header and Interactive Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-sm font-bold text-white/40 uppercase tracking-wider font-display">
          Forecast Trends
        </h3>
        
        <div className="flex bg-white/5 p-1 rounded-xl gap-0.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('temp')}
            className={`py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 ${
              activeTab === 'temp'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiThermometer className="w-3.5 h-3.5" />
            <span>Temp</span>
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 ${
              activeTab === 'rain'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiCloudRain className="w-3.5 h-3.5" />
            <span>Precipitation</span>
          </button>
          <button
            onClick={() => setActiveTab('humidity')}
            className={`py-1.5 px-3.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 ${
              activeTab === 'humidity'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <FiDroplet className="w-3.5 h-3.5" />
            <span>Humidity</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="flex-1 w-full text-xs min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.03)" />
            
            <XAxis
              dataKey="name"
              stroke="rgba(255, 255, 255, 0.25)"
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            
            <YAxis
              stroke="rgba(255, 255, 255, 0.25)"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}${activeConfig.unit}`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey={activeConfig.dataKey}
              stroke={activeConfig.strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${activeConfig.fillColorId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
