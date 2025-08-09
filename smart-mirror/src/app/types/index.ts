// src/types/index.ts
export interface WeatherData {
  location: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast: {
    day: string;
    high: number;
    low: number;
    icon: string;
  }[];
}

export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  urlToImage?: string;
}

export interface MirrorSettings {
  location: string;
  units: 'metric' | 'imperial';
  newsCategories: string[];
  displayBrightness: number;
  showWeather: boolean;
  showNews: boolean;
  showClock: boolean;
  showNotes: boolean;
}

export interface UserNote {
  _id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  createdAt: string;
}