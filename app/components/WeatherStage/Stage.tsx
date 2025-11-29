'use client';

import { useMemo } from 'react';
import Image from 'next/image';
import Background from './Background';
import WeatherEffects from './WeatherEffects';

interface StageProps {
  weatherData: {
    temperature: number;
    weather?: string;
    weatherCode: string;
    isDay: boolean;
    windSpeed: number;
    pop?: number; // 降雨機率
  };
}

export default function Stage({ weatherData }: StageProps) {
  const { isDay, weatherCode, windSpeed, temperature, weather, pop = 0 } = weatherData;
  
  // 判斷天氣狀態
  const isRaining = weatherCode.includes('10') || weather?.includes('雨') || pop > 70;
  const isSnowing = weatherCode.includes('13') || weather?.includes('雪');
  const isCloudy = weatherCode.includes('02') || weatherCode.includes('03') || weatherCode.includes('04') || weather?.includes('雲') || weather?.includes('陰');
  const isSunny = weatherCode.includes('01') || weather?.includes('晴');
  const isWindy = windSpeed > 10;

  // 根據天氣生成 RPG 風格提示文字
  const weatherPrompt = useMemo(() => {
    if (isRaining || weather?.includes('雨')) {
      return '道路泥濘，建議在旅店休息（穿個雨衣吧）。';
    } else if (isSnowing || weather?.includes('雪')) {
      return '這是冰霜巨龍的氣息嗎？記得多穿一件裝備。';
    } else if (isWindy) {
      return '狂風呪呗！行走速度 -20%，小心被吹走。';
    } else if (temperature > 30) {
      return '烈日當空！記得補充水分，小心中暑狀態。';
    } else if (temperature < 15) {
      return '寒風刺骨，裝備保暖道具可提升防禦力。';
    } else if (!isDay) {
      return '夜深了，黑暗中潛藏著危險與機會...';
    } else if (isSunny || weather?.includes('晴')) {
      return '適合出發冒險的日子！體力恢復速度 +10%。';
    } else {
      return '天氣穩定，是探索未知領域的好時機。';
    }
  }, [isRaining, isSnowing, isWindy, isSunny, isDay, temperature, weather]);
  
  return (
    <div className="relative w-full h-[330px] rounded-lg overflow-hidden border-4 border-black shadow-2xl">
      
      {/* ========== Z-0: 天空層 (Sky Layer) ========== */}
      <Background 
        isDay={isDay} 
        weatherCode={weatherCode}
        isCloudy={isCloudy}
        isRaining={isRaining}
        isWindy={isWindy}
      />
      
      {/* ========== Z-10: 城鎮背景層 (Town Background) ========== */}
      <div className="absolute inset-0 z-10">
        {/* 城鎮背景圖 - 天空透明 */}
        <div className="absolute bottom-0 left-0 w-full h-full">
          <Image 
            src="/bg-new-1129.png" 
            alt="Town Background"
            fill
            className=" object-contain object-bottom"
            style={{ 
              imageRendering: 'pixelated',
            }}
            priority
          />
        </div>
        
        {/* 環境光遮罩 (Ambient Light Overlay) */}
        <div 
          className={`absolute inset-0 transition-all duration-1000 pointer-events-none
            ${!isDay 
              ? 'bg-[rgba(10,10,60,0.55)]' // 夜晚：深藍色調
              : isRaining 
                ? 'bg-[rgba(50,50,70,0.35)]' // 雨天：灰暗
                : isCloudy
                  ? 'bg-[rgba(100,100,120,0.15)]' // 陰天：輕微灰色
                  : 'bg-transparent' // 晴天：無遮罩
            }`}
        />
      </div>
      
      {/* ========== Z-20: 物件層 (Objects/NPCs) ========== */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* 夜間路燈光效 */}
        {!isDay && (
          <>
            {/* 左側路燈光暈 */}
            <div 
              className="absolute bottom-20 left-[15%] w-24 h-32 rounded-full opacity-40"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,200,100,0.6) 0%, rgba(255,180,80,0.3) 40%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
            {/* 右側路燈光暈 */}
            <div 
              className="absolute bottom-20 right-[15%] w-24 h-32 rounded-full opacity-40"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,200,100,0.6) 0%, rgba(255,180,80,0.3) 40%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
            {/* 中央水井微光 */}
            <div 
              className="absolute bottom-16 left-1/2 -translate-x-1/2 w-16 h-12 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(100,150,255,0.5) 0%, transparent 70%)',
                filter: 'blur(6px)',
              }}
            />
          </>
        )}
        
        {/* 雪天地面積雪效果 */}
        {isSnowing && (
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            }}
          />
        )}
        
        {/* 晴天時的攤販/裝飾 - 可以之後加入獨立 NPC 組件 */}
        {isDay && isSunny && !isRaining && (
          <div className="absolute bottom-8 left-[8%]">
            {/* 未來可放攤販精靈圖 */}
          </div>
        )}
      </div>

      {/* ========== Z-30: 天氣提示層 (Weather Prompt) ========== */}
      <div className="absolute inset-x-0 bottom-4 z-30 flex justify-center px-4">
        <div className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-black/50 px-4 py-2">
          <p className="font-pixel flex items-center justify-center text-center text-xs leading-relaxed text-yellow-300">
            {weatherPrompt}
          </p>
        </div>
      </div>
      
      {/* ========== Z-40: 天氣特效層 (Weather Effects) ========== */}
      <div className="absolute inset-0 z-40 pointer-events-none">
        <WeatherEffects 
          weatherCode={weatherCode}
          windSpeed={windSpeed}
          temperature={temperature}
        />
      </div>
      
    </div>
  );
}
