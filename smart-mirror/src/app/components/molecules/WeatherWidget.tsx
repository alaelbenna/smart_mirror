// src/app/components/molecules/WeatherWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { WeatherData } from '@/app/types';
import WeatherIcon from '../atoms/WeatherIcon';

interface WeatherWidgetProps {
  location?: string;
  units?: 'metric' | 'imperial';
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ 
  location = 'Tunis', 
  units = 'metric' 
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?location=${location}&units=${units}`);
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes

    return () => clearInterval(interval);
  }, [location, units]);

  if (loading) {
    return <div className="text-white">Loading weather...</div>;
  }

  if (!weather) {
    return <div className="text-red-400">Failed to load weather</div>;
  }

  const unitSymbol = units === 'metric' ? '°C' : '°F';

  return (
    <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{weather.location}</h3>
          <p className="text-3xl font-light">{weather.temperature}{unitSymbol}</p>
          <p className="text-gray-300 capitalize">{weather.description}</p>
        </div>
        <WeatherIcon icon={weather.icon} size={64} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>Humidity: {weather.humidity}%</div>
        <div>Wind: {weather.windSpeed} {units === 'metric' ? 'm/s' : 'mph'}</div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">5-Day Forecast</h4>
        <div className="flex justify-between">
          {weather.forecast.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-xs">{day.day}</div>
              <WeatherIcon icon={day.icon} size={24} />
              <div className="text-xs">
                {day.high}° / {day.low}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;