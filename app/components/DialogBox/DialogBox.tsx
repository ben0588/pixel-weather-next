'use client';

import Typewriter from './Typewriter';

interface DialogBoxProps {
  weatherData: {
    city: string;
    temperature: number;
    weather: string;
    humidity: number;
    windSpeed: number;
    weatherCode: string;
  };
}

export default function DialogBox({ weatherData }: DialogBoxProps) {
  // 根據天氣生成 RPG 風格的提示文字
  const getWeatherPrompt = () => {
    const { temperature, weather, weatherCode } = weatherData;
    
    if (weatherCode.includes('10') || weather.includes('雨')) {
      return '道路泥濘，建議在旅店休息（帶把傘吧）。';
    } else if (weatherCode.includes('13') || weather.includes('雪')) {
      return '這是冰霜巨龍的氣息嗎？記得多穿一件裝備。';
    } else if (temperature > 30) {
      return '烈日當空！記得補充水分，小心中暑狀態。';
    } else if (temperature < 15) {
      return '寒風刺骨，裝備保暖道具可提升防禦力。';
    } else if (weatherCode.includes('01') || weather.includes('晴')) {
      return '適合出發冒險的日子！體力恢復速度 +10%。';
    } else {
      return '天氣穩定，是探索未知領域的好時機。';
    }
  };

  const weatherPrompt = getWeatherPrompt();

  return (
    <div className="w-full">
      {/* RPG 風格對話框 */}
      <div className="relative bg-black border-4 border-white rounded-lg p-4 md:p-6 shadow-2xl">
        {/* 裝飾角落 */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-yellow-400 -mt-1 -ml-1" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-yellow-400 -mt-1 -mr-1" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-yellow-400 -mb-1 -ml-1" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-yellow-400 -mb-1 -mr-1" />

        {/* 標題列 */}
        <div className="flex items-center gap-2 mb-3 md:mb-4 pb-2 md:pb-3 border-b-2 border-gray-700">
          <span className="text-xl md:text-2xl">📜</span>
          <h3 className="text-yellow-400 font-pixel text-sm md:text-lg">勇者的天氣日誌</h3>
        </div>

        {/* 位置資訊 */}
        <div className="mb-3 md:mb-4">
          <p className="text-cyan-400 font-pixel text-xs md:text-sm">
            <Typewriter 
              text={`▶ 當前位置：${weatherData.city}`}
              speed={30}
            />
          </p>
        </div>

        {/* 天氣狀況 */}
        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
          <div className="flex justify-between">
            <span className="text-white font-pixel text-sm">天氣狀況：</span>
            <span className="text-green-400 font-pixel text-sm">{weatherData.weather}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white font-pixel text-sm">氣溫：</span>
            <span className="text-orange-400 font-pixel text-sm">{weatherData.temperature}°C</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white font-pixel text-sm">濕度：</span>
            <span className="text-blue-400 font-pixel text-sm">{weatherData.humidity}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white font-pixel text-sm">風速：</span>
            <span className="text-purple-400 font-pixel text-sm">{weatherData.windSpeed} m/s</span>
          </div>
        </div>

        {/* 分隔線 */}
        <div className="border-t-2 border-gray-700 my-3 md:my-4" />

        {/* RPG 風格提示 */}
        <div className="bg-gray-900/50 border-2 border-gray-700 rounded p-2 md:p-3">
          <p className="text-yellow-300 font-pixel text-xs md:text-sm leading-relaxed">
            <Typewriter 
              text={weatherPrompt}
              speed={40}
            />
          </p>
        </div>

        {/* 閃爍的繼續提示 */}
        <div className="flex justify-end mt-3">
          <span className="text-white font-pixel text-xs animate-pulse">▼</span>
        </div>
      </div>
    </div>
  );
}
