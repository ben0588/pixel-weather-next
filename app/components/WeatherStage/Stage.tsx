'use client';

import Background from './Background';
import Character from './Character';
import WeatherEffects from './WeatherEffects';

interface StageProps {
  weatherData: {
    temperature: number;
    weatherCode: string;
    isDay: boolean;
    windSpeed: number;
  };
}

export default function Stage({ weatherData }: StageProps) {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] lg:h-[500px] rounded-lg overflow-hidden border-4 border-black shadow-2xl">
      {/* 背景層 */}
      <Background isDay={weatherData.isDay} weatherCode={weatherData.weatherCode} />
      
      {/* 地面 */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-800 to-green-600 z-5" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-green-900 z-5" />
      
      {/* 角色層 */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Character 
          weatherCode={weatherData.weatherCode} 
          temperature={weatherData.temperature} 
        />
      </div>
      
      {/* 天氣特效層 */}
      <WeatherEffects 
        weatherCode={weatherData.weatherCode}
        windSpeed={weatherData.windSpeed}
        temperature={weatherData.temperature}
      />
    </div>
  );
}
