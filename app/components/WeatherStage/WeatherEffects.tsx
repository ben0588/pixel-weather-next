'use client';

import { useEffect, useState } from 'react';

interface WeatherEffectsProps {
  weatherCode: string;
  windSpeed: number;
  temperature: number;
}

export default function WeatherEffects({ weatherCode, windSpeed, temperature }: WeatherEffectsProps) {
  const [raindrops, setRaindrops] = useState<number[]>([]);

  // 根據天氣代碼決定要顯示的特效
  const isRaining = weatherCode.includes('10') || weatherCode === '雨';
  const isSnowing = weatherCode.includes('13') || weatherCode === '雪';
  const isSunny = weatherCode.includes('01') || weatherCode === '晴';

  // 生成雨滴
  useEffect(() => {
    if (isRaining || isSnowing) {
      const dropCount = isSnowing ? 30 : 50; // 雪花較少
      setRaindrops(Array.from({ length: dropCount }, (_, i) => i));
    } else {
      setRaindrops([]);
    }
  }, [isRaining, isSnowing]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* 下雨特效 */}
      {isRaining && (
        <div className="absolute inset-0">
          {raindrops.map((i) => (
            <div
              key={i}
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 下雪特效 */}
      {isSnowing && (
        <div className="absolute inset-0">
          {raindrops.map((i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              ❄️
            </div>
          ))}
        </div>
      )}

      {/* 大太陽眩光效果 */}
      {isSunny && temperature > 28 && (
        <div className="absolute inset-0 bg-gradient-radial from-yellow-200/20 via-transparent to-transparent mix-blend-overlay" />
      )}

      {/* 風的效果 - 如果風速大 */}
      {windSpeed > 5 && (
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="wind-line"
              style={{
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
