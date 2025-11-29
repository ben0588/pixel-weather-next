'use client';

import { useEffect, useState } from 'react';

interface WeatherEffectsProps {
  weatherCode: string;
  windSpeed: number;
  temperature: number;
}

interface Drop {
  id: number;
  left: string;
  animationDelay: string;
  animationDuration: string;
  opacity: number;
}

interface WindLine {
  id: number;
  top: string;
  width: string;
  animationDelay: string;
  animationDuration: string;
  opacity: number;
}

interface Puddle {
  id: number;
  left: string;
  animationDelay: string;
  scale: number;
}

export default function WeatherEffects({ weatherCode, windSpeed, temperature }: Readonly<WeatherEffectsProps>) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [windLines, setWindLines] = useState<WindLine[]>([]);
  const [puddles, setPuddles] = useState<Puddle[]>([]);
  const [lightning, setLightning] = useState(false);

  // 判斷天氣狀態
  const isRaining = weatherCode.includes('10') || weatherCode === '雨' || weatherCode.includes('雨');
  const isHeavyRain = weatherCode === '豪大雨' || (isRaining && windSpeed > 10); // 簡單判斷豪大雨
  const isSnowing = weatherCode.includes('13') || weatherCode === '雪';
  const isSunny = (weatherCode.includes('01') || weatherCode === '晴') && temperature > 28;
  
  // 判斷風速 (大於 5m/s 視為有風)
  const isWindy = windSpeed > 5;

  // 生成雨滴/雪花
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isRaining || isSnowing) {
        // 根據是否下雪決定數量 (雪花通常比較少且飄得慢)
        let count = 80;
        if (isSnowing) {
          count = 40;
        } else if (isHeavyRain) {
          count = 120;
        }
        
        setDrops(Array.from({ length: count }, (_, i) => ({
          id: i,
          left: `${Math.random() * 100}%`,
          // 使用負值延遲，讓動畫一開始就處於進行中狀態，避免看到頂部有靜止的點
          animationDelay: `${-Math.random() * (isSnowing ? 10 : 2)}s`,
          animationDuration: isSnowing 
            ? `${3 + Math.random() * 4}s` // 雪花飄落較慢 (3-7秒)
            : `${0.4 + Math.random() * 0.2}s`, // 雨滴落下較快
          opacity: Math.random() * 0.5 + 0.3,
        })));

        // 如果是下雨，生成地面水灘
        if (isRaining) {
          setPuddles(Array.from({ length: 5 }, (_, i) => ({
            id: i,
            left: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 2}s`,
            scale: 0.5 + Math.random()
          })));
        } else {
          setPuddles([]);
        }
      } else {
        setDrops([]);
        setPuddles([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isRaining, isSnowing, isHeavyRain]);  // 豪大雨閃電效果
  useEffect(() => {
    if (isHeavyRain) {
      const triggerLightning = () => {
        setLightning(true);
        setTimeout(() => setLightning(false), 800); // 閃電持續時間
        
        // 隨機下次閃電時間 (2~8秒)
        const nextFlash = Math.random() * 6000 + 2000;
        timeoutId = setTimeout(triggerLightning, nextFlash);
      };

      let timeoutId = setTimeout(triggerLightning, 2000);
      return () => clearTimeout(timeoutId);
    } else {
      const timer = setTimeout(() => setLightning(false), 0);
      return () => clearTimeout(timer);
    }
  }, [isHeavyRain]);

  // 生成風切線
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isWindy) {
        // 風速越強，線條越多 (降低數量，原本是 * 1.5)
        const count = Math.min(Math.floor(windSpeed * 0.8), 15);
        setWindLines(Array.from({ length: count }, (_, i) => ({
          id: i,
          top: `${Math.random() * 100}%`,
          width: `${80 + Math.random() * 150}px`, // 長度增加
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${0.5 + Math.random() * 0.8}s`, // 速度變慢 (原本 0.3)
          opacity: Math.random() * 0.3 + 0.1, // 透明度降低 (原本 0.2~0.6)
        })));
      } else {
        setWindLines([]);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [isWindy, windSpeed]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {/* 豪大雨閃電特效 */}
      {lightning && <div className="lightning-flash animate-flash" />}

      {/* 
        1. 下雨 / 下雪特效 
        使用 CSS animation 讓小 div 從上往下掉
      */}
      {(isRaining || isSnowing) && (
        <div className={`absolute inset-0 ${isWindy ? 'rotate-12 scale-110' : ''} transition-transform duration-1000`}>
          {drops.map((drop) => (
            <div
              key={drop.id}
              className={isSnowing ? 'snowflake' : 'raindrop'}
              style={{
                left: drop.left,
                top: '-50px', // 將起始點移出畫面外
                animationDelay: drop.animationDelay,
                animationDuration: drop.animationDuration,
                opacity: drop.opacity,
              }}
            >
              {isSnowing ? '❄' : ''}
            </div>
          ))}
        </div>
      )}

      {/* 地面水灘特效 */}
      {isRaining && puddles.map((puddle) => (
        <div
          key={`puddle-${puddle.id}`}
          className="puddle"
          style={{
            left: puddle.left,
            animationDelay: puddle.animationDelay,
            transform: `scale(${puddle.scale})`,
          }}
        />
      ))}

      {/* 
        2. 大太陽 / 眩光 (Sun Glare)
        使用 mix-blend-mode: overlay 創造氛圍感
      */}
      {isSunny && (
        <>
          <div className="sun-glare animate-pulse" />
          <div className="sun-icon">☀️</div>
        </>
      )}

      {/* 
        3. 吹風 / 晃動 (Wind)
        這裡示範如何將 sway 動畫應用在物件上。
        由於目前背景是單張圖，我們可以用一個透明的層或未來的樹木組件來應用此效果。
        這裡我們讓整個畫面在極端強風下微微晃動，增加張力。
      */}
      {windSpeed > 10 && (
        <div className="absolute inset-0 mix-blend-overlay bg-white/5 animate-sway" />
      )}

      {/* 
        4. 風切線特效 (Wind Lines)
        快速飛過的線條，增加速度感
      */}
      {isWindy && (
        <div className="absolute inset-0">
          {windLines.map((line) => (
            <div
              key={`wind-${line.id}`}
              className="wind-line"
              style={{
                top: line.top,
                width: line.width,
                animationDelay: line.animationDelay,
                animationDuration: line.animationDuration,
                opacity: line.opacity,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
