import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import Home from './pages/Home';

function App() {
  return (
    <WeatherProvider>
      <Home />
    </WeatherProvider>
  );
}

export default App;
