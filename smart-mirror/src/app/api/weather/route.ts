// src/app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get('location') || 'Tunis';
  const units = searchParams.get('units') || 'metric';

  // Check if API key exists
  if (!process.env.WEATHER_API_KEY) {
    console.error('WEATHER_API_KEY is not set in environment variables');
    return NextResponse.json(
      { error: 'Weather API key not configured' },
      { status: 500 }
    );
  }

  try {
    console.log(`Fetching weather for ${location} with units ${units}`);
    
    // WeatherAPI.com endpoints
    // Current weather + 3-day forecast in one call
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}&days=5&aqi=no&alerts=no`;
    
    console.log('WeatherAPI URL (without API key):', weatherUrl.replace(process.env.WEATHER_API_KEY, 'API_KEY'));
    
    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('WeatherAPI Error:', response.status, errorText);
      
      // Handle specific API errors
      if (response.status === 400) {
        return NextResponse.json(
          { error: 'Invalid request or location not found' },
          { status: 400 }
        );
      } else if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: 'Invalid API key or API limit exceeded' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: 'Weather API request failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Weather data received for:', data.location.name);

    // Convert temperature based on units preference
    const getCurrentTemp = () => {
      return units === 'metric' ? data.current.temp_c : data.current.temp_f;
    };

    const getWindSpeed = () => {
      return units === 'metric' ? data.current.wind_kph : data.current.wind_mph;
    };

    // Process forecast data
    const dailyForecast = data.forecast.forecastday.map((day: any) => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      high: units === 'metric' ? Math.round(day.day.maxtemp_c) : Math.round(day.day.maxtemp_f),
      low: units === 'metric' ? Math.round(day.day.mintemp_c) : Math.round(day.day.mintemp_f),
      icon: day.day.condition.icon.split('/').pop()?.replace('.png', '') || '01d', // Extract icon code
      condition: day.day.condition.text,
    }));

    const weatherData = {
      location: `${data.location.name}, ${data.location.country}`,
      temperature: Math.round(getCurrentTemp()),
      description: data.current.condition.text,
      humidity: data.current.humidity,
      windSpeed: getWindSpeed(),
      icon: data.current.condition.icon.split('/').pop()?.replace('.png', '') || '01d',
      forecast: dailyForecast,
      // Additional WeatherAPI.com specific data
      feelsLike: units === 'metric' ? Math.round(data.current.feelslike_c) : Math.round(data.current.feelslike_f),
      uv: data.current.uv,
      visibility: units === 'metric' ? data.current.vis_km : data.current.vis_miles,
      localTime: data.location.localtime,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('WeatherAPI Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}