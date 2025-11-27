'use client';

import { useState } from 'react';
import { FaAnglesDown } from "react-icons/fa6";

interface LocationMenuProps {
  currentCity: string;
  onCityChange: (city: string) => void;
}

// 台灣主要城市列表
const TAIWAN_CITIES = [
  { name: '台北市', icon: '🏙️' },
  { name: '新北市', icon: '🌆' },
  { name: '桃園市', icon: '✈️' },
  { name: '台中市', icon: '🏛️' },
  { name: '台南市', icon: '🏰' },
  { name: '高雄市', icon: '⚓' },
  { name: '基隆市', icon: '🚢' },
  { name: '新竹市', icon: '🎓' },
  { name: '嘉義市', icon: '🌳' },
];

export default function LocationMenu({ currentCity, onCityChange }: LocationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCitySelect = (cityName: string) => {
    onCityChange(cityName);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      {/* 傳送點按鈕 - 緊湊版 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 
                   border-2 border-white rounded-md shadow-lg hover:scale-105 
                   transform transition-all duration-200 active:scale-95 backdrop-blur-sm bg-opacity-95"
      >
        <span className="text-lg animate-pulse">🌍</span>
        <div className="text-left">
          <p className="text-yellow-300 font-pixel text-[10px] leading-tight">{currentCity}</p>
        </div>
        <span className={`text-white text-sm transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <FaAnglesDown />
        </span>
      </button>

      {/* 下拉選單 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 選單內容 */}
          <div className="absolute top-full mt-2 left-0 w-48 bg-black border-2 border-white 
                         rounded-md shadow-2xl z-50 max-h-80 overflow-y-auto">
            {/* 標題 */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-900 to-blue-900 
                           border-b-2 border-white px-3 py-2 z-10">
              <p className="text-yellow-400 font-pixel text-[10px] text-center">
                選擇傳送目的地
              </p>
            </div>

            {/* 城市列表 */}
            <div className="p-1.5">
              {TAIWAN_CITIES.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleCitySelect(city.name)}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-md
                             transition-all duration-150 mb-1
                             ${currentCity === city.name 
                               ? 'bg-yellow-600 border border-yellow-400' 
                               : 'bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-gray-500'
                             }`}
                >
                  <span className="text-base">{city.icon}</span>
                  <span className={`font-pixel text-[10px] flex-1 text-left
                                   ${currentCity === city.name ? 'text-white' : 'text-gray-300'}`}>
                    {city.name}
                  </span>
                  {currentCity === city.name && (
                    <span className="text-white font-pixel text-[8px]">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* 底部提示 */}
            <div className="border-t-2 border-gray-700 px-2.5 py-1.5 bg-gray-900">
              <p className="text-gray-400 font-pixel text-[8px] text-center">
                選擇城市查看當地天氣
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
