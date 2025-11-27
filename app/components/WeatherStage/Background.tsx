'use client';

interface BackgroundProps {
  isDay: boolean;
  weatherCode: string;
}

export default function Background({ isDay, weatherCode }: BackgroundProps) {
  // 根據時間決定背景色調
  const getBackgroundClass = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 12) {
      // 早晨 - 亮藍色
      return 'from-blue-300 via-blue-200 to-cyan-100';
    } else if (hour >= 12 && hour < 17) {
      // 中午到下午 - 天藍色
      return 'from-sky-400 via-blue-300 to-blue-200';
    } else if (hour >= 17 && hour < 19) {
      // 傍晚 - 橘紅色
      return 'from-orange-400 via-pink-300 to-purple-300';
    } else {
      // 晚上 - 深紫色
      return 'from-indigo-900 via-purple-900 to-blue-900';
    }
  };

  // 根據天氣調整背景
  const getWeatherOverlay = () => {
    if (weatherCode.includes('10') || weatherCode === '雨') {
      // 雨天 - 灰暗一點
      return 'bg-gray-900/20';
    } else if (weatherCode.includes('13') || weatherCode === '雪') {
      // 雪天 - 偏白
      return 'bg-white/30';
    }
    return '';
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 主背景漸層 */}
      <div className={`absolute inset-0 bg-gradient-to-b ${getBackgroundClass()} transition-colors duration-1000`} />
      
      {/* 天氣覆蓋層 */}
      {getWeatherOverlay() && (
        <div className={`absolute inset-0 ${getWeatherOverlay()} transition-opacity duration-500`} />
      )}
      
      {/* 像素化的雲朵裝飾 (可選) */}
      {isDay && (
        <>
          <div className="absolute top-10 left-10 w-24 h-12 bg-white/60 rounded-full pixel-cloud animate-float" 
               style={{ animationDelay: '0s' }} />
          <div className="absolute top-20 right-20 w-32 h-14 bg-white/50 rounded-full pixel-cloud animate-float" 
               style={{ animationDelay: '2s' }} />
          <div className="absolute top-32 left-1/3 w-28 h-12 bg-white/40 rounded-full pixel-cloud animate-float" 
               style={{ animationDelay: '4s' }} />
        </>
      )}
      
      {/* 晚上的星星 */}
      {!isDay && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
