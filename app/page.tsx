'use client';

import { useEffect, useState } from 'react';
import Stage from './components/WeatherStage/Stage';
import DialogBox from './components/DialogBox/DialogBox';
import LocationMenu from './components/LocationMenu/LocationMenu';
import DebugMenu from './components/DebugMenu/DebugMenu';
import { useIPLocation } from './hooks/useIPLocation';
import { useWeather } from './hooks/useWeather';

const CITY_STORAGE_KEY = 'pixel-weather-selected-city';

export default function Home() {
  const { location, loading: locationLoading } = useIPLocation();
  const [initialCity, setInitialCity] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 初始化時從 localStorage 讀取城市
  useEffect(() => {
    // 優先使用 localStorage 儲存的城市
    const savedCity = localStorage.getItem(CITY_STORAGE_KEY);
    if (savedCity) {
      setInitialCity(savedCity);
      setIsInitialized(true);
    }
  }, []);

  // 當 IP 位置載入完成且沒有儲存的城市時，使用 IP 定位結果
  useEffect(() => {
    if (!isInitialized && !locationLoading) {
      if (location?.city) {
        setInitialCity(location.city);
      } else {
        setInitialCity('台北市'); // 預設城市
      }
      setIsInitialized(true);
    }
  }, [location, locationLoading, isInitialized]);

  const { weatherData, loading: weatherLoading, updateCity, currentCity } = useWeather(initialCity || '台北市');
  
  // 處理城市變更並儲存到 localStorage
  const handleCityChange = (city: string) => {
    localStorage.setItem(CITY_STORAGE_KEY, city);
    updateCity(city);
  };

  // 用於強制 DialogBox 重新掛載的 key
  const [dialogKey, setDialogKey] = useState(0);
  
  // 當天氣資料改變時更新 key
  useEffect(() => {
    if (weatherData) {
      setDialogKey(prev => prev + 1);
    }
  }, [weatherData]);
  
  // Debug 模式的覆蓋資料
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [overrideWeather, setOverrideWeather] = useState<any>(null);

  const handleScenarioChange = (scenario: string) => {
    if (scenario === 'reset') {
      setOverrideWeather(null);
      return;
    }

    const baseWeather = {
      city: '測試場景',
      locationName: 'Debug Zone',
      humidity: 50,
      observationTime: new Date().toISOString(),
    };

    switch (scenario) {
      case 'sunny':
        setOverrideWeather({
          ...baseWeather,
          temperature: 35,
          weather: '晴朗炎熱',
          weatherCode: '01',
          windSpeed: 2,
          isDay: true,
        });
        break;
      case 'comfort':
        setOverrideWeather({
          ...baseWeather,
          temperature: 24,
          weather: '晴時多雲',
          weatherCode: '02',
          windSpeed: 3,
          isDay: true,
          pop: 0,
        });
        break;
      case 'rain':
        setOverrideWeather({
          ...baseWeather,
          temperature: 20,
          weather: '下雨',
          weatherCode: '10', // Rain code
          windSpeed: 4,
          isDay: true,
        });
        break;
      case 'heavy-rain':
        setOverrideWeather({
          ...baseWeather,
          temperature: 18,
          weather: '豪大雨',
          weatherCode: '10', // Rain code
          windSpeed: 12, // Windy
          isDay: false, // Darker
        });
        break;
      case 'snow':
        setOverrideWeather({
          ...baseWeather,
          temperature: -2,
          weather: '下雪',
          weatherCode: '13', // Snow code
          windSpeed: 3,
          isDay: true,
        });
        break;
      case 'windy':
        setOverrideWeather({
          ...baseWeather,
          temperature: 22,
          weather: '強風',
          weatherCode: '02', // Cloudy
          windSpeed: 15, // Very windy
          isDay: true,
        });
        break;
      case 'night':
        setOverrideWeather({
          ...baseWeather,
          temperature: 18,
          weather: '晴朗夜晚',
          weatherCode: '01',
          windSpeed: 2,
          isDay: false,
        });
        break;
    }
  };

  const isLoading = locationLoading || weatherLoading;
  const displayWeather = overrideWeather || weatherData;

  return (
    <div className=" max-auto min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black overflow-x-hidden">
      {/* Debug Menu - 右上角 */}
      <DebugMenu onScenarioChange={handleScenarioChange} />

      {/* 頂部標題區 */}
      <header className="relative z-10 my-2">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-yellow-400 font-pixel text-2xl md:text-4xl mb-2 drop-shadow-lg">
              像素天氣日誌
            </h1>
            <p className="text-gray-300 font-pixel text-xs md:text-sm">
              Pixel Weather
            </p>
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="container mx-auto px-4 py-2 main-w-[414px] max-w-[550px]">
        {(!displayWeather && isLoading) ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-4xl md:text-6xl mb-4 animate-bounce">⚔️</div>
            <p className="text-white font-pixel text-xs md:text-sm animate-pulse">
              正在探索天氣資訊...
            </p>
          </div>
        ) : displayWeather ? (
          <>
            {/* 上方：天氣舞台區 */}
            <div className="w-full relative mb-6">
              {/* 左上角傳送門 */}
              <div className="absolute top-4 left-4 z-50">
                {!isLoading && !overrideWeather && (
                  <LocationMenu 
                    currentCity={currentCity}
                    onCityChange={handleCityChange}
                  />
                )}
                {/* Loading Indicator when switching cities */}
                {isLoading && !overrideWeather && (
                   <div className="bg-black/50 text-white px-2 py-1 rounded text-xs font-pixel animate-pulse backdrop-blur-sm border border-white/20">
                    移動中...
                  </div>
                )}
                {overrideWeather && (
                  <div className="bg-red-500/80 text-white px-2 py-1 rounded text-xs font-pixel animate-pulse">
                TEST MODE
                  </div>
                )}
              </div>
              
              {/* 天氣舞台 */}
              <div className="relative z-0">
                <Stage weatherData={displayWeather} isDebugMode={!!overrideWeather} />
              </div>
            </div>

            {/* 下方：資訊對話框 */}
            <div className="w-full relative z-0">
              <DialogBox 
                key={`dialog-${displayWeather.city}-${dialogKey}`} 
                weatherData={displayWeather} 
              />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-4xl md:text-6xl mb-4">❌</div>
            <p className="text-red-400 font-pixel text-xs md:text-sm">
              無法載入天氣資訊
            </p>
          </div>
        )}
      </main>

      {/* 底部資訊 */}
      <footer className="relative z-10 py-8 mt-12 border-t-2 border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500 font-pixel text-xs">
            資料來源：中央氣象署開放資料平台
          </p>
          <p className="text-gray-600 font-pixel text-xs mt-2">
            Powered by Next.js & Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}

