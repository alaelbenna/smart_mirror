// src/app/components/atoms/WeatherIcon.tsx
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  CloudSnow, 
  Zap, 
  CloudDrizzle,
  CloudFog,
  Wind
} from 'lucide-react';

interface WeatherIconProps {
  icon: string;
  size?: number;
  condition?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ icon, size = 48, condition = '' }) => {
  // WeatherAPI.com icon codes mapping
  const getIconFromCondition = (iconCode: string, conditionText: string) => {
    const lowerCondition = conditionText.toLowerCase();
    
    // WeatherAPI.com icon codes (simplified mapping)
    if (iconCode.includes('116') || iconCode.includes('119') || iconCode.includes('122')) {
      // Partly cloudy variations
      return <Cloud size={size} className="text-gray-300" />;
    }
    
    if (iconCode.includes('113')) {
      // Sunny/Clear
      return <Sun size={size} className="text-yellow-400" />;
    }
    
    if (iconCode.includes('296') || iconCode.includes('299') || iconCode.includes('302') || iconCode.includes('305')) {
      // Light rain
      return <CloudDrizzle size={size} className="text-blue-400" />;
    }
    
    if (iconCode.includes('308') || iconCode.includes('311') || iconCode.includes('314') || iconCode.includes('317')) {
      // Heavy rain
      return <CloudRain size={size} className="text-blue-500" />;
    }
    
    if (iconCode.includes('323') || iconCode.includes('326') || iconCode.includes('329') || iconCode.includes('332')) {
      // Snow
      return <CloudSnow size={size} className="text-white" />;
    }
    
    if (iconCode.includes('386') || iconCode.includes('389') || iconCode.includes('392') || iconCode.includes('395')) {
      // Thunderstorm
      return <Zap size={size} className="text-yellow-500" />;
    }
    
    if (iconCode.includes('143') || iconCode.includes('248') || iconCode.includes('260')) {
      // Fog/Mist
      return <CloudFog size={size} className="text-gray-400" />;
    }
    
    // Fallback based on condition text
    if (lowerCondition.includes('sunny') || lowerCondition.includes('clear')) {
      return <Sun size={size} className="text-yellow-400" />;
    }
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return <CloudRain size={size} className="text-blue-400" />;
    }
    if (lowerCondition.includes('snow') || lowerCondition.includes('blizzard')) {
      return <CloudSnow size={size} className="text-white" />;
    }
    if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
      return <Zap size={size} className="text-yellow-500" />;
    }
    if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return <Cloud size={size} className="text-gray-300" />;
    }
    if (lowerCondition.includes('mist') || lowerCondition.includes('fog')) {
      return <CloudFog size={size} className="text-gray-400" />;
    }
    if (lowerCondition.includes('wind')) {
      return <Wind size={size} className="text-gray-300" />;
    }
    
    // Default fallback
    return <Sun size={size} className="text-yellow-400" />;
  };

  return (
    <div className="flex items-center justify-center">
      {getIconFromCondition(icon, condition || '')}
    </div>
  );
};

export default WeatherIcon;