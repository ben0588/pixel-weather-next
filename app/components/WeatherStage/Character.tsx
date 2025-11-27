'use client';

interface CharacterProps {
  weatherCode: string;
  temperature: number;
}

export default function Character({ weatherCode, temperature }: CharacterProps) {
  // 根據天氣狀況決定角色狀態
  const getCharacterState = () => {
    if (weatherCode.includes('10') || weatherCode === '雨') {
      return 'rainy'; // 撐傘
    } else if (weatherCode.includes('13') || weatherCode === '雪') {
      return 'cold'; // 穿厚衣服
    } else if (temperature > 30) {
      return 'hot'; // 戴墨鏡/流汗
    } else if (temperature < 15) {
      return 'cold'; // 發抖/穿厚衣服
    } else {
      return 'normal'; // 一般狀態
    }
  };

  const characterState = getCharacterState();

  // 角色動畫類別
  const getAnimationClass = () => {
    if (characterState === 'cold') {
      return 'animate-shiver'; // 發抖動畫
    } else if (characterState === 'hot') {
      return 'animate-bounce-slow'; // 緩慢彈跳
    }
    return 'animate-idle'; // 待機動畫
  };

  // 角色說明文字
  const getCharacterEmoji = () => {
    switch (characterState) {
      case 'rainy':
        return '☔';
      case 'cold':
        return '🧥';
      case 'hot':
        return '😎';
      default:
        return '🧙';
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center">
      {/* 像素化角色 - 使用 emoji 作為臨時圖像 */}
      <div className={`text-[120px] ${getAnimationClass()} pixel-art`}>
        {getCharacterEmoji()}
      </div>
      
      {/* 角色狀態指示 */}
      <div className="mt-4 px-4 py-2 bg-black/50 rounded-lg border-2 border-white/30">
        <p className="text-white text-sm font-pixel text-center">
          {characterState === 'rainy' && '帶著雨傘的勇者'}
          {characterState === 'cold' && '穿著厚裝備的勇者'}
          {characterState === 'hot' && '準備冒險的勇者'}
          {characterState === 'normal' && '整裝待發的勇者'}
        </p>
      </div>
    </div>
  );
}
