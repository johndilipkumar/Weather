# 🌤️ Weatherly - Modern Weather Forecast Dashboard

A beautiful and responsive weather application that provides real-time weather information, hourly forecasts, and 7-day weather predictions using the Open-Meteo API.

Built with React, Vite, Tailwind CSS, and modern UI/UX principles, Weatherly delivers accurate weather insights with an elegant and user-friendly interface.

---

## ✨ Features

### 🔍 Location Search
- Search weather information for any city worldwide
- Fast and accurate location lookup
- Autocomplete search suggestions
- Recent search history

### 🌡️ Current Weather
- Real-time temperature
- Weather condition icons
- City and country information
- Date and time display
- Weather descriptions

### 📊 Detailed Weather Metrics
- Feels Like Temperature
- Humidity Percentage
- Wind Speed
- Wind Direction
- Visibility
- Atmospheric Pressure
- UV Index
- Precipitation Data

### 📅 7-Day Forecast
- Daily weather predictions
- High and low temperatures
- Weather condition icons
- Responsive forecast cards

### ⏰ Hourly Forecast
- Hour-by-hour weather updates
- Temperature trends
- Interactive weather cards
- Day selection functionality

### ⚙️ Unit Conversion
Switch between:

#### Temperature
- Celsius (°C)
- Fahrenheit (°F)

#### Wind Speed
- km/h
- mph

#### Precipitation
- Millimeters (mm)
- Inches (in)

User preferences are automatically saved using local storage.

### ⭐ Favorites
- Save favorite cities
- Quick access to frequently viewed locations
- Remove cities anytime

### 📈 Weather Charts
- Temperature trends
- Humidity analysis
- Rain probability
- Interactive visualizations

### 🎨 Dynamic Weather Backgrounds
Backgrounds change automatically based on weather conditions:

- ☀️ Sunny
- ☁️ Cloudy
- 🌧️ Rainy
- ❄️ Snowy
- ⛈️ Stormy
- 🌙 Night Mode

### 📱 Fully Responsive
Optimized for:

- Mobile Devices
- Tablets
- Laptops
- Desktop Computers
- Ultra-Wide Screens

---

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- JavaScript (ES6+)

### APIs
- Open-Meteo Weather API
- Open-Meteo Geocoding API

### Libraries
- Framer Motion
- Recharts
- React Icons

---

## 📂 Project Structure

```text
src/
├── assets/
│
├── api/
│   ├── weatherApi.js
│   └── geocodingApi.js
│
├── components/
│   ├── SearchBar.jsx
│   ├── CurrentWeather.jsx
│   ├── WeatherMetrics.jsx
│   ├── Forecast7Day.jsx
│   ├── HourlyForecast.jsx
│   ├── WeatherChart.jsx
│   ├── Favorites.jsx
│   ├── UnitSelector.jsx
│   ├── WeatherBackground.jsx
│   ├── LoadingSkeleton.jsx
│   └── ErrorState.jsx
│
├── hooks/
│   ├── useWeather.js
│   ├── useForecast.js
│   └── useLocalStorage.js
│
├── context/
│   └── WeatherContext.jsx
│
├── pages/
│   └── Home.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/johndilipkumar/Weather.git
```

### Navigate to Project

```bash
cd Weather
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

---

## 📦 Production Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 🌍 API Integration

This project uses:

### Open-Meteo Weather API

Provides:

- Current weather data
- Hourly forecasts
- Daily forecasts
- Weather metrics

### Open-Meteo Geocoding API

Provides:

- City search
- Location coordinates
- Country and region information

No API key required.

---

## ♿ Accessibility

Weatherly follows accessibility best practices:

- Semantic HTML
- Keyboard Navigation
- ARIA Labels
- Focus States
- Screen Reader Support
- Responsive Typography

---

## 🎯 Performance Optimizations

- Lazy Loading
- Efficient API Requests
- Local Storage Caching
- Reusable React Components
- Optimized Rendering
- Responsive Images

---

## 👨‍💻 Author

**JohnDilip**

GitHub: https://github.com/johndilipkumar

Portfolio: https://github.com/johndilipkumar

---

Feel free to use, modify, and distribute this project for personal and educational purposes.
