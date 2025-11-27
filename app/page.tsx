'use client';

import { useEffect, useState } from 'react';
import Stage from './components/WeatherStage/Stage';
import DialogBox from './components/DialogBox/DialogBox';
import LocationMenu from './components/LocationMenu/LocationMenu';
import { useIPLocation } from './hooks/useIPLocation';
import { useWeather } from './hooks/useWeather';

export default function Home() {
  const { location, loading: locationLoading } = useIPLocation();
  const [initialCity, setInitialCity] = useState('台北市');
  
  // 當位置載入完成後，設定初始城市
  useEffect(() => {
    if (location?.city) {
      setInitialCity(location.city);
    }
  }, [location]);

  const { weatherData, loading: weatherLoading, updateCity, currentCity } = useWeather(initialCity);

  const isLoading = locationLoading || weatherLoading;

  return (
    <div className=" max-auto min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black overflow-x-hidden">
      {/* 頂部標題區 */}
      <header className="relative z-10 ">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-yellow-400 font-pixel text-2xl md:text-4xl mb-2 drop-shadow-lg">
              勇者的天氣日誌
            </h1>
            <p className="text-gray-300 font-pixel text-xs md:text-sm">
              Pixel Weather RPG
            </p>
          </div>
        </div>
      </header>

      {/* 主要內容區 */}
      <main className="container mx-auto px-4 py-2 max-w-[414px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-4xl md:text-6xl mb-4 animate-bounce">⚔️</div>
            <p className="text-white font-pixel text-xs md:text-sm animate-pulse">
              正在探索天氣資訊...
            </p>
          </div>
        ) : weatherData ? (
          <>
            {/* 初次進入提示 */}
            {/* {location && (
              <div className="text-center mb-4">
                <p className="text-cyan-400 font-pixel text-xs md:text-sm animate-fade-in">
                  ✨ 偵測到勇者目前位於 [{location.city}] 區域
                </p>
              </div>
            )} */}

            {/* 上方：天氣舞台區 */}
            <div className="w-full relative mb-6">
              {/* 左上角傳送門 */}
              <div className="absolute top-4 left-4 z-50">
                {!isLoading && weatherData && (
                  <LocationMenu 
                    currentCity={currentCity}
                    onCityChange={updateCity}
                  />
                )}
              </div>
              
              {/* 天氣舞台 */}
              <div className="relative z-0">
                <Stage weatherData={weatherData} />
              </div>
            </div>

            {/* 下方：資訊對話框 */}
            <div className="w-full relative z-0">
              <DialogBox weatherData={weatherData} />
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

