'use client';

import { useEffect, useState, useMemo } from 'react';

// 取得台灣時間的小時 (UTC+8)
const getTaiwanHour = (): number => {
  const now = new Date();
  // 使用 toLocaleString 取得台灣時區的時間
  const taiwanTime = now.toLocaleString('en-US', { 
    timeZone: 'Asia/Taipei',
    hour: 'numeric',
    hour12: false 
  });
  return parseInt(taiwanTime, 10);
};

interface BackgroundProps {
  isDay: boolean;
  weatherCode: string;
  isCloudy?: boolean;
  showClouds?: boolean; // 顯示雲朵動畫（包括晴時多雲）
  isRaining?: boolean;
  isWindy?: boolean;
  currentHour?: number; // 當前小時 (0-23)
  forceTimeOverride?: boolean; // Debug 模式強制覆蓋時間
}

export default function Background({ isDay, weatherCode, isCloudy = false, showClouds = false, isRaining = false, isWindy = false, currentHour, forceTimeOverride = false }: BackgroundProps) {
  const [stars, setStars] = useState<Array<{id: number, left: string, top: string, delay: string, size: number, opacity: number}>>([]);
  const [hour, setHour] = useState<number>(currentHour ?? getTaiwanHour());

  // 更新當前小時（使用台灣時區）
  useEffect(() => {
    if (currentHour !== undefined) {
      setHour(currentHour);
    } else {
      const updateHour = () => setHour(getTaiwanHour());
      updateHour();
      const interval = setInterval(updateHour, 60000);
      return () => clearInterval(interval);
    }
  }, [currentHour]);

  // 根據本地時間計算是否為白天
  const localIsDay = useMemo(() => {
    return hour >= 6 && hour < 18;
  }, [hour]);

  // 實際使用的 isDay：Debug 模式用 props，否則用本地時間
  const effectiveIsDay = forceTimeOverride ? isDay : localIsDay;

  // 判斷時段（簡化為早上/下午/夜晚）
  const timeOfDay = useMemo(() => {
    if (effectiveIsDay) {
      if (hour >= 6 && hour < 12) return 'morning';
      return 'afternoon';
    }
    return 'night';
  }, [hour, effectiveIsDay]);

  // 根據時間和天氣獲取天空漸層
  const getSkyGradient = useMemo(() => {
    // 雨天/暴風雨 - 深灰色調
    if (isRaining || weatherCode.includes('10')) {
      return effectiveIsDay 
        ? 'linear-gradient(180deg, #4a5568 0%, #718096 30%, #a0aec0 70%, #cbd5e0 100%)' // 白天雨天
        : 'linear-gradient(180deg, #1a202c 0%, #2d3748 40%, #4a5568 80%, #718096 100%)'; // 夜晚雨天
    }
    
    // 雪天 - 偏白灰藍
    if (weatherCode.includes('13')) {
      return effectiveIsDay
        ? 'linear-gradient(180deg, #e2e8f0 0%, #cbd5e0 40%, #a0aec0 100%)'
        : 'linear-gradient(180deg, #2d3748 0%, #4a5568 50%, #718096 100%)';
    }
    
    // 陰天/多雲（不包括晴時多雲）
    if (isCloudy) {
      return effectiveIsDay
        ? 'linear-gradient(180deg, #87a4c4 0%, #a8c4db 40%, #c9dae8 70%, #e8f0f5 100%)' // 白天陰天
        : 'linear-gradient(180deg, #1e2a3a 0%, #2c3e50 50%, #34495e 100%)'; // 夜晚陰天
    }
    
    // 根據時段返回不同天空（晴天/晴時多雲）
    switch (timeOfDay) {
      case 'morning':
        // 早晨 - 清新藍天
        return 'linear-gradient(180deg, #1e90ff 0%, #4aa8ff 25%, #87ceeb 50%, #b0e2ff 75%, #e0f4ff 100%)';
      case 'afternoon':
        // 下午 - 明亮藍天
        return 'linear-gradient(180deg, #0077be 0%, #1e90ff 25%, #4aa8ff 50%, #87ceeb 75%, #b0e2ff 100%)';
      case 'night':
      default:
        // 夜晚 - 深紫到深藍漸層（原版漂亮的版本）
        return 'linear-gradient(180deg, #0f0c29 0%, #1a1a4a 25%, #24243e 50%, #2c2c54 75%, #302b63 100%)';
    }
  }, [effectiveIsDay, weatherCode, isCloudy, isRaining, timeOfDay]);

  // 判斷是否為夜晚時段
  const isNightTime = useMemo(() => {
    return !effectiveIsDay;
  }, [effectiveIsDay]);

  // 生成星星 (夜晚且非雨天時顯示)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isNightTime && !isRaining) {
        const newStars = Array.from({ length: 35 }).map((_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 50}%`, // 只在上半部
          delay: `${Math.random() * 3}s`,
          size: Math.random() > 0.8 ? 2 : 1, // 20% 機率較大星星
          opacity: Math.random() * 0.6 + 0.4,
        }));
        setStars(newStars);
      } else {
        setStars([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isNightTime, isRaining, isCloudy]);

  return (
    <div 
      className="absolute inset-0 z-0 transition-all duration-1000"
      style={{ background: getSkyGradient }}
    >
     
      
      {/* 星星 (夜晚晴朗時) */}
      {isNightTime && stars.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star) => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                left: star.left,
                top: star.top,
                width: `${star.size}px`,
                height: `${star.size}px`,
                animationDelay: star.delay,
                opacity: star.opacity,
                boxShadow: star.size > 1 ? '0 0 4px rgba(255,255,255,0.8)' : 'none',
              }}
            />
          ))}
        </div>
      )}
      
      {/* 雲朵 (多雲/陰天/晴時多雲時) */}
      {showClouds && effectiveIsDay && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 雲朵 1 - 大型蓬鬆雲 */}
          <div className="absolute top-6 -left-10 animate-cloud-drift" style={{ animationDuration: isWindy ? '12s' : '35s' }}>
            <div className="relative">
              {/* 主體 */}
              <div className="absolute w-24 h-12 bg-white rounded-full" style={{ left: '20px', top: '10px' }} />
              {/* 左側隆起 */}
              <div className="absolute w-16 h-14 bg-white rounded-full" style={{ left: '0px', top: '6px' }} />
              {/* 右側隆起 */}
              <div className="absolute w-20 h-16 bg-white rounded-full" style={{ left: '35px', top: '0px' }} />
              {/* 頂部小隆起 */}
              <div className="absolute w-12 h-10 bg-white rounded-full" style={{ left: '25px', top: '-4px' }} />
              {/* 底部陰影 */}
              <div className="absolute w-28 h-6 bg-gray-200/60 rounded-full" style={{ left: '10px', top: '18px', filter: 'blur(2px)' }} />
            </div>
          </div>
          
          {/* 雲朵 2 - 中型雲 */}
          <div className="absolute top-2 left-1/3 animate-cloud-drift" style={{ animationDuration: isWindy ? '10s' : '28s', animationDelay: '3s' }}>
            <div className="relative opacity-90">
              <div className="absolute w-20 h-10 bg-white rounded-full" style={{ left: '10px', top: '8px' }} />
              <div className="absolute w-14 h-12 bg-white rounded-full" style={{ left: '0px', top: '4px' }} />
              <div className="absolute w-16 h-14 bg-white rounded-full" style={{ left: '18px', top: '0px' }} />
              <div className="absolute w-10 h-8 bg-white rounded-full" style={{ left: '30px', top: '2px' }} />
              <div className="absolute w-22 h-4 bg-gray-200/50 rounded-full" style={{ left: '5px', top: '14px', filter: 'blur(2px)' }} />
            </div>
          </div>
          
          {/* 雲朵 3 - 後方大型雲（較淡） */}
          <div className="absolute top-12 right-1/4 animate-cloud-drift" style={{ animationDuration: isWindy ? '14s' : '40s', animationDelay: '8s' }}>
            <div className="relative opacity-70">
              <div className="absolute w-28 h-14 bg-white/90 rounded-full" style={{ left: '15px', top: '10px' }} />
              <div className="absolute w-18 h-16 bg-white/90 rounded-full" style={{ left: '0px', top: '5px' }} />
              <div className="absolute w-22 h-18 bg-white/90 rounded-full" style={{ left: '30px', top: '0px' }} />
              <div className="absolute w-14 h-12 bg-white/90 rounded-full" style={{ left: '45px', top: '4px' }} />
              <div className="absolute w-32 h-5 bg-gray-300/40 rounded-full" style={{ left: '10px', top: '18px', filter: 'blur(3px)' }} />
            </div>
          </div>
          
          {/* 雲朵 4 - 小型雲 */}
          <div className="absolute top-20 -left-5 animate-cloud-drift" style={{ animationDuration: isWindy ? '8s' : '22s', animationDelay: '12s' }}>
            <div className="relative opacity-85">
              <div className="absolute w-14 h-8 bg-white rounded-full" style={{ left: '8px', top: '6px' }} />
              <div className="absolute w-10 h-10 bg-white rounded-full" style={{ left: '0px', top: '2px' }} />
              <div className="absolute w-12 h-10 bg-white rounded-full" style={{ left: '12px', top: '0px' }} />
              <div className="absolute w-16 h-3 bg-gray-200/50 rounded-full" style={{ left: '4px', top: '12px', filter: 'blur(1px)' }} />
            </div>
          </div>
          
          {/* 雲朵 5 - 遠處小雲 */}
          <div className="absolute top-4 right-10 animate-cloud-drift" style={{ animationDuration: isWindy ? '11s' : '32s', animationDelay: '6s' }}>
            <div className="relative opacity-60">
              <div className="absolute w-12 h-6 bg-white/80 rounded-full" style={{ left: '5px', top: '4px' }} />
              <div className="absolute w-8 h-8 bg-white/80 rounded-full" style={{ left: '0px', top: '0px' }} />
              <div className="absolute w-10 h-8 bg-white/80 rounded-full" style={{ left: '8px', top: '-2px' }} />
            </div>
          </div>
        </div>
      )}

      {/* 夜晚雲朵 (多雲/陰天/晴時多雲夜晚時) */}
      {showClouds && !effectiveIsDay && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* 夜晚雲朵 1 */}
          <div className="absolute top-8 -left-10 animate-cloud-drift" style={{ animationDuration: isWindy ? '14s' : '40s' }}>
            <div className="relative opacity-40">
              <div className="absolute w-24 h-12 bg-slate-400 rounded-full" style={{ left: '20px', top: '10px' }} />
              <div className="absolute w-16 h-14 bg-slate-400 rounded-full" style={{ left: '0px', top: '6px' }} />
              <div className="absolute w-20 h-16 bg-slate-400 rounded-full" style={{ left: '35px', top: '0px' }} />
            </div>
          </div>
          
          {/* 夜晚雲朵 2 */}
          <div className="absolute top-4 left-1/3 animate-cloud-drift" style={{ animationDuration: isWindy ? '12s' : '35s', animationDelay: '5s' }}>
            <div className="relative opacity-35">
              <div className="absolute w-20 h-10 bg-slate-500 rounded-full" style={{ left: '10px', top: '8px' }} />
              <div className="absolute w-14 h-12 bg-slate-500 rounded-full" style={{ left: '0px', top: '4px' }} />
              <div className="absolute w-16 h-14 bg-slate-500 rounded-full" style={{ left: '18px', top: '0px' }} />
            </div>
          </div>
          
          {/* 夜晚雲朵 3 */}
          <div className="absolute top-16 right-1/4 animate-cloud-drift" style={{ animationDuration: isWindy ? '15s' : '45s', animationDelay: '10s' }}>
            <div className="relative opacity-30">
              <div className="absolute w-28 h-14 bg-slate-400 rounded-full" style={{ left: '15px', top: '10px' }} />
              <div className="absolute w-18 h-16 bg-slate-400 rounded-full" style={{ left: '0px', top: '5px' }} />
              <div className="absolute w-22 h-18 bg-slate-400 rounded-full" style={{ left: '30px', top: '0px' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
