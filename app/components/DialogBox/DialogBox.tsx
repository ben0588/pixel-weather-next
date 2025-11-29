"use client";

import { useState, useEffect } from "react";
import Typewriter from "./Typewriter";

interface DialogBoxProps {
  weatherData: {
    city: string;
    temperature: number;
    weather: string;
    humidity: number;
    windSpeed: number;
    weatherCode: string;
    pop?: number; // 降雨機率
  };
}

export default function DialogBox({ weatherData }: Readonly<DialogBoxProps>) {
  // 當前日期時間
  const [currentTime, setCurrentTime] = useState<string>("");

  // 計算距離夜幕降臨的時間
  const [hoursUntilNight, setHoursUntilNight] = useState<number>(0);
  const [currentHour, setCurrentHour] = useState<number>(12);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
      const weekday = weekdays[now.getDay()];

      const formatted = now
        .toLocaleString("zh-TW", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
        .replace(/(\d+\/\d+)/, `$1 (${weekday})`);

      setCurrentTime(formatted);
      setCurrentHour(hour);

      // 計算距離 18:00 夜幕降臨還有多久
      if (hour >= 6 && hour < 18) {
        setHoursUntilNight(18 - hour);
      } else {
        setHoursUntilNight(0); // 已經是夜晚
      }
    };

    updateTime(); // 初始化
    const interval = setInterval(updateTime, 60000); // 每分鐘更新
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* RPG 風格對話框 */}
      <div className="relative rounded-lg border-4 border-black bg-black p-4 shadow-2xl md:p-6">
        {/* 裝飾角落 */}
        <div className="absolute top-0 left-0 -mt-1 -ml-1 h-4 w-4 border-t-4 border-l-4 border-yellow-400" />
        <div className="absolute top-0 right-0 -mt-1 -mr-1 h-4 w-4 border-t-4 border-r-4 border-yellow-400" />
        <div className="absolute bottom-0 left-0 -mb-1 -ml-1 h-4 w-4 border-b-4 border-l-4 border-yellow-400" />
        <div className="absolute right-0 bottom-0 -mr-1 -mb-1 h-4 w-4 border-r-4 border-b-4 border-yellow-400" />

        {/* 標題列 */}
        <div className="mb-3 flex items-center justify-between border-b-2 border-gray-700 pb-2 md:mb-4 md:pb-3">
          <p className="font-pixel  text-xs text-cyan-400 md:text-sm">
            <Typewriter text={`▶ 當前位置：${weatherData.city}`} speed={30} />
          </p>
        {currentTime && (
            <span className="font-pixel text-xs text-gray-400">
              🕒 {currentTime}
            </span>
          )}
        </div>



        {/* 日夜進度條 */}
        <div className="mb-3 rounded border-2 border-gray-700 bg-gray-900/50 p-2 md:mb-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-pixel text-[10px] text-yellow-400">
              {currentHour >= 6 && currentHour < 18 ? "☀️" : "🌙"}
            </span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-800">
              {/* 日夜漸層背景 */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, #1a1a4a 0%, #4aa8ff 25%, #87ceeb 50%, #ff9966 75%, #1a1a4a 100%)",
                }}
              />
              {/* 當前時間指示器 */}
              <div
                className="absolute top-0 h-full w-1 bg-white shadow-[0_0_4px_white] transition-all duration-300"
                style={{
                  left: `${((currentHour + new Date().getMinutes() / 60) / 24) * 100}%`,
                }}
              />
            </div>
            <span className="font-pixel text-[10px] text-blue-400">
              {currentHour >= 6 && currentHour < 18 ? "🌙" : "☀️"}
            </span>
          </div>
          <p className="font-pixel text-center text-[10px]">
            {currentHour >= 6 && currentHour < 18 ? (
              <span className="text-orange-300">
                🌅 距離夜幕降臨還有 {hoursUntilNight} 小時
              </span>
            ) : (
              <span className="text-indigo-300">🌃 夜晚時刻，小心行動</span>
            )}
          </p>
        </div>

        {/* 天氣狀況 */}
        <div className="mb-3 space-y-1.5 md:mb-4 md:space-y-2">
          <div className="flex justify-between">
            <span className="font-pixel text-sm text-white">天氣狀況：</span>
            <span className="font-pixel text-sm text-green-400">
              {weatherData.weather}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-pixel text-sm text-white">氣溫：</span>
            <span className="font-pixel text-sm text-orange-400">
              {weatherData.temperature}°C
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-pixel text-sm text-white">降雨機率：</span>
            <span
              className={`font-pixel text-sm ${(weatherData.pop ?? 0) > 50 ? "text-cyan-400" : "text-gray-400"}`}
            >
              {weatherData.pop ?? 0}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-pixel text-sm text-white">濕度：</span>
            <span className="font-pixel text-sm text-blue-400">
              {weatherData.humidity}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-pixel text-sm text-white">風速：</span>
            <span className="font-pixel text-sm text-purple-400">
              {weatherData.windSpeed} m/s
            </span>
          </div>
        </div>

        {/* 分隔線 */}
        <div className="my-3 border-t-2 border-gray-700 md:my-4" />

        {/* 閃爍的繼續提示 */}
        <div className="mt-3 flex justify-end">
          <span className="font-pixel animate-pulse text-xs text-white">▼</span>
        </div>
      </div>
    </div>
  );
}
