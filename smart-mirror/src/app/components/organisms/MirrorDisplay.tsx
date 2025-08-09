// src/app/components/organisms/MirrorDisplay.tsx
'use client';

import { useState, useEffect } from 'react';
import Clock from '../atoms/Clock';
import WeatherWidget from '../molecules/WeatherWidget';
import NewsWidget from '../molecules/NewsWidget';
import NotesWidget from '../molecules/NotesWidget';
import { MirrorSettings } from '@/app/types';

const MirrorDisplay: React.FC = () => {
  const [settings, setSettings] = useState<MirrorSettings>({
    location: 'Tunis',
    units: 'metric',
    newsCategories: ['technology'],
    displayBrightness: 80,
    showWeather: true,
    showNews: true,
    showClock: true,
    showNotes: true,
  });

  return (
    <div 
      className="h-screen w-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900"
      style={{ 
        opacity: settings.displayBrightness / 100,
      }}
    >
      {/* Top Section */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
        {settings.showWeather && (
          <WeatherWidget 
            location={settings.location} 
            units={settings.units} 
          />
        )}
        
        {settings.showNews && (
          <div className="max-w-md">
            <NewsWidget category={settings.newsCategories[0]} />
          </div>
        )}
      </div>

      {/* Center Section - Clock */}
      <div className="absolute inset-0 flex items-center justify-center">
        {settings.showClock && <Clock />}
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
        {settings.showNotes && (
          <div className="max-w-md">
            <NotesWidget />
          </div>
        )}
        
        <div className="text-right text-gray-400 text-sm">
          Smart Mirror v1.0
        </div>
      </div>
    </div>
  );
};

export default MirrorDisplay;