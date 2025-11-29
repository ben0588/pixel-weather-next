'use client';

import { useMemo, useState } from 'react';
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
  isDebugMode?: boolean; // Debug 模式強制覆寫時間
}

export default function Stage({ weatherData, isDebugMode = false }: StageProps) {
  const { isDay, weatherCode, windSpeed, temperature, weather, pop = 0 } = weatherData;
  
  // 布告欄連結確認對話框狀態
  const [showLinkConfirm, setShowLinkConfirm] = useState(false);
  const authorWebsite = 'https://nextjs-personal-site-pi.vercel.app/'; // 作者個人網站
  
  const handleBulletinClick = () => {
    setShowLinkConfirm(true);
  };
  
  const handleConfirmLink = () => {
    window.open(authorWebsite, '_blank', 'noopener,noreferrer');
    setShowLinkConfirm(false);
  };
  
  const handleCancelLink = () => {
    setShowLinkConfirm(false);
  };
  
  // 判斷天氣狀態
  const isRaining = weatherCode.includes('10') || weather?.includes('雨') || pop > 70;
  const isSnowing = weatherCode.includes('13') || weather?.includes('雪');
  // 「晴時多雲」不算陰天（天空顏色用），只有「多雲」「陰天」才算
  const isCloudy = (weatherCode.includes('03') || weatherCode.includes('04') || weather?.includes('陰')) && !weather?.includes('晴');
  // 顯示雲朵動畫（包括晴時多雲、多雲、陰天、有風）
  const showClouds = weatherCode.includes('02') || weatherCode.includes('03') || weatherCode.includes('04') || weather?.includes('雲') || weather?.includes('陰');
  const isSunny = weatherCode.includes('01') || weather?.includes('晴');
  const isWindy = windSpeed > 10;

  // 判斷是否為豪大雨
  const isHeavyRain = weather?.includes('豪') || weather?.includes('大雨') || pop >= 90;

  // 根據天氣生成 RPG 風格提示文字
  const weatherPrompt = useMemo(() => {
    if (isHeavyRain) {
      return '⚠️ 暴風雨警報！怪物出沒率 +50%，建議待在安全區域。';
    } else if (isRaining || weather?.includes('雨')) {
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
  }, [isHeavyRain, isRaining, isSnowing, isWindy, isSunny, isDay, temperature, weather]);
  
  return (
    <div className="relative w-full h-[330px] rounded-lg overflow-hidden border-4 border-black shadow-2xl">
      
      {/* ========== Z-0: 天空層 (Sky Layer) ========== */}
      <Background 
        isDay={isDay} 
        weatherCode={weatherCode}
        isCloudy={isCloudy}
        showClouds={showClouds}
        isRaining={isRaining}
        isWindy={isWindy}
        forceTimeOverride={isDebugMode}
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
      
      {/* ========== Z-50: 物件層 (Objects/NPCs) ========== */}
      <div className="absolute inset-0 z-50">
        {/* 布告欄互動區塊 - 可點擊前往作者網站 */}
        {/* 位置：水井右邊的布告欄 */}
        <button
          onClick={handleBulletinClick}
          className="absolute cursor-pointer group"
          style={{
            // 布告欄位置：畫面中心偏右（水井右邊）
            bottom: '12%',
            right: '26%',
            width: '60px',
            height: '40px',
            // 開發時可開啟查看位置
            // border: '2px solid red',
          }}
          aria-label="前往作者個人網站"
        >
          {/* 閃爍光暈效果 */}
          <div 
            className="absolute inset-0 rounded animate-bulletin-glow"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255,200,50,0.5) 0%, rgba(255,150,0,0.2) 60%, transparent 100%)',
              filter: 'blur(4px)',
            }}
          />
          
          {/* 像素風白色十字星星 - 左上兩顆 + 右中兩顆 */}
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {/* === 左上角星星組 === */}
            {/* 大星星 */}
            <div className="absolute -top-1 -left-1 animate-pixel-star-1">
              <div className="relative" style={{ width: '7px', height: '7px' }}>
                <div className="absolute bg-white" style={{ width: '1px', height: '1px', top: '3px', left: '3px' }} />
                <div className="absolute bg-white" style={{ width: '1px', height: '3px', top: '0px', left: '3px' }} />
                <div className="absolute bg-white" style={{ width: '1px', height: '3px', bottom: '0px', left: '3px' }} />
                <div className="absolute bg-white" style={{ width: '3px', height: '1px', top: '3px', left: '0px' }} />
                <div className="absolute bg-white" style={{ width: '3px', height: '1px', top: '3px', right: '0px' }} />
              </div>
            </div>
            {/* 小星星（相鄰右下） */}
            <div className="absolute top-1 left-1 animate-pixel-star-2">
              <div className="relative" style={{ width: '5px', height: '5px' }}>
                <div className="absolute bg-white" style={{ width: '1px', height: '1px', top: '2px', left: '2px' }} />
                <div className="absolute bg-white" style={{ width: '1px', height: '2px', top: '0px', left: '2px' }} />
                <div className="absolute bg-white" style={{ width: '1px', height: '2px', bottom: '0px', left: '2px' }} />
                <div className="absolute bg-white" style={{ width: '2px', height: '1px', top: '2px', left: '0px' }} />
                <div className="absolute bg-white" style={{ width: '2px', height: '1px', top: '2px', right: '0px' }} />
              </div>
            </div>
            
            {/* === 右中星星組 === */}
            {/* 大星星 */}
            <div className="absolute top-1 -right-2 animate-pixel-star-3">
              <div className="relative" style={{ width: '7px', height: '7px' }}>
                <div className="absolute bg-white" style={{ width: '1px', height: '1px', top: '3px', left: '3px' }} />
                <div className="absolute bg-white" style={{ width: '1px', height: '3px', top: '0px', left: '3px' }} />
                <div className="absolute bg-white" style={{ width: '1px', height: '3px', bottom: '0px', left: '3px' }} />
                <div className="absolute bg-white" style={{ width: '3px', height: '1px', top: '3px', left: '0px' }} />
                <div className="absolute bg-white" style={{ width: '3px', height: '1px', top: '3px', right: '0px' }} />
              </div>
            </div>
            {/* 小星星（相鄰左下） */}
            <div className="absolute top-5 -right-1 animate-pixel-star-1">
              <div className="relative" style={{ width: '5px', height: '5px' }}>
                <div className="absolute bg-white" style={{ width: '1px', height: '1px', top: '2px', left: '2px' }} />
                <div className="absolute bg-white" style={{ width: '1px', height: '2px', top: '0px', left: '2px' }} />
                <div className="absolute bg-white" style={{ width: '1px', height: '2px', bottom: '0px', left: '2px' }} />
                <div className="absolute bg-white" style={{ width: '2px', height: '1px', top: '2px', left: '0px' }} />
                <div className="absolute bg-white" style={{ width: '2px', height: '1px', top: '2px', right: '0px' }} />
              </div>
            </div>
          </div>
          
          {/* Hover 提示 - 放在上方避免擋到下方視窗 */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            <span className="bg-black/90 text-yellow-300 text-[10px] px-2 py-1 rounded border border-yellow-500/50 font-pixel shadow-lg">
              ✨ 發現隱藏的密道
            </span>
          </div>
        </button>
        
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
      
      {/* ========== Z-50: 布告欄連結確認對話框 ========== */}
      {showLinkConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-4 border-yellow-500/80 rounded-lg p-4 mx-4 max-w-xs shadow-2xl animate-fade-in">
            {/* 對話框標題 */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-yellow-500/30">
              <span className="text-xl">📜</span>
              <h3 className="font-pixel text-yellow-300 text-sm">冒險者公告</h3>
            </div>
            
            {/* 對話框內容 */}
            <div className="font-pixel text-white text-xs leading-relaxed mb-4 space-y-2">
              <p>你即將離開此地，前往作者的秘密基地…</p>
              <p className="text-yellow-200/80 text-[10px]">🔗 {authorWebsite}</p>
            </div>
            
            {/* 按鈕區 */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleCancelLink}
                className="font-pixel text-xs px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded border border-slate-500 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmLink}
                className="font-pixel text-xs px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white rounded border border-yellow-400 transition-colors animate-pulse-slow"
              >
                🚩 出發！
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
