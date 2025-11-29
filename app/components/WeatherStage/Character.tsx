"use client";

import styles from "./Character.module.css";

interface CharacterProps {
  weatherCode: string;
  temperature: number;
  weatherPrompt?: string;
  isRaining?: boolean;
  isSunny?: boolean;
}

export default function Character({
  weatherCode,
  temperature,
  weatherPrompt,
  isRaining = false,
  isSunny = false,
}: CharacterProps) {
  // 根據天氣狀況決定角色狀態
  const getCharacterState = () => {
    if (
      weatherCode.includes("10") ||
      weatherCode === "雨" ||
      weatherCode.includes("雨")
    ) {
      return "rain"; // 下雨狀態 (穿防水暗色的連帽披)
    } else if (
      weatherCode.includes("13") ||
      weatherCode === "雪" ||
      temperature < 15
    ) {
      return "winter"; // 冬天狀態 (穿厚的連身披風)
    } else if (temperature > 30) {
      return "sunny"; // 大太陽狀態 (戴墨鏡+流汗)
    } else {
      return "comfort"; // 舒適狀態 (一般呼吸)
    }
  };

  const characterState = getCharacterState();

  // 根據狀態取得對應的 CSS class
  const getWeatherClass = (type: string) => {
    switch (type) {
      case "sunny":
        return styles.weatherSunny;
      case "rain":
        return styles.weatherRain;
      case "winter":
        return styles.weatherWinter;
      default:
        return styles.weatherComfort;
    }
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center">
      {/* 像素化角色 - 使用 Sprite Sheet */}
      <div className={styles.heroContainer}>
        <div
          className={`${styles.heroCharacter} ${getWeatherClass(characterState)}`}
          aria-label={`Hero character - ${characterState}`}
        />
      </div>

      {/* 角色狀態指示 */}
      <div className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-white/30 bg-black/50 px-4 py-2">
        <p className="font-pixel flex items-center justify-center text-center text-xs leading-relaxed text-yellow-300">
          {weatherPrompt ?? (
            <>
              {characterState === "rain" && "帶著雨傘的勇者"}
              {characterState === "winter" && "穿著厚裝備的勇者"}
              {characterState === "sunny" && "戴著墨鏡的勇者"}
              {characterState === "comfort" && "整裝待發的勇者"}
            </>
          )}
        </p>
      </div>
    </div>
  );
}
