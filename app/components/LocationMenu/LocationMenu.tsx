"use client";

import { useState } from "react";

interface LocationMenuProps {
  currentCity: string;
  onCityChange: (city: string) => void;
}

// 台灣所有縣市列表（按照北中南東離島分類）
const TAIWAN_REGIONS = [
  {
    region: "北部",
    cities: [
      { name: "台北市", icon: "🏙️" },
      { name: "新北市", icon: "🌆" },
      { name: "基隆市", icon: "⚓" },
      { name: "桃園市", icon: "✈️" },
      { name: "新竹市", icon: "🔬" },
      { name: "新竹縣", icon: "🏔️" },
      { name: "宜蘭縣", icon: "🌾" },
    ],
  },
  {
    region: "中部",
    cities: [
      { name: "苗栗縣", icon: "🍊" },
      { name: "台中市", icon: "🏛️" },
      { name: "彰化縣", icon: "🌻" },
      { name: "南投縣", icon: "⛰️" },
      { name: "雲林縣", icon: "🥜" },
    ],
  },
  {
    region: "南部",
    cities: [
      { name: "嘉義市", icon: "🌳" },
      { name: "嘉義縣", icon: "🍍" },
      { name: "台南市", icon: "🏰" },
      { name: "高雄市", icon: "🚢" },
      { name: "屏東縣", icon: "🌴" },
    ],
  },
  {
    region: "東部",
    cities: [
      { name: "花蓮縣", icon: "🏞️" },
      { name: "台東縣", icon: "🎈" },
    ],
  },
  {
    region: "離島",
    cities: [
      { name: "澎湖縣", icon: "🐚" },
      { name: "金門縣", icon: "🦁" },
      { name: "連江縣", icon: "🏝️" },
    ],
  },
];

export default function LocationMenu({
  currentCity,
  onCityChange,
}: LocationMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCitySelect = (cityName: string) => {
    onCityChange(cityName);
    setIsOpen(false);
  };

  return (
      <div className="relative z-50">
      {/* 傳送圈按鈕 - RPG 風格 */}
          <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex h-14 w-14 cursor-pointer items-center justify-center transition-all duration-300 active:scale-90 ${isOpen ? "scale-110" : "hover:scale-105"}`}
      >
        {/* 外圈 - 旋轉光環 */}
        <div
          className={`absolute inset-0 rounded-full border-2 border-cyan-400 ${isOpen ? "animate-spin" : "group-hover:animate-spin"}`}
          style={{ animationDuration: "3s" }}
        />

        {/* 中圈 - 反向旋轉 */}
        <div
          className={`absolute inset-1 rounded-full border-2 border-dashed border-purple-400 ${isOpen ? "animate-spin" : "group-hover:animate-spin"} shadow-[0_0_10px_rgba(192,132,252,0.5)]`}
          style={{ animationDuration: "2s", animationDirection: "reverse" }}
        />

        {/* 內圈背景 */}
        <div className="absolute inset-2 rounded-full border border-cyan-300/50 bg-gradient-to-br from-indigo-900 via-purple-900 to-cyan-900 shadow-inner" />

        {/* 魔法陣圖案 */}
        <div className="absolute inset-3 flex items-center justify-center rounded-full">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full text-cyan-300 opacity-60"
          >
            {/* 六芒星 */}
            <polygon
              points="50,10 61,35 90,35 67,55 78,85 50,67 22,85 33,55 10,35 39,35"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            {/* 內圓 */}
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* 中心傳送門符號 */}
        <div className="relative z-10 text-xl">✦</div>

        {/* 發光粒子效果 */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div className="absolute top-2 left-1/2 h-1 w-1 animate-ping rounded-full bg-cyan-300" />
          <div
            className="absolute right-2 bottom-3 h-1 w-1 animate-ping rounded-full bg-purple-300"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute top-1/2 left-2 h-1 w-1 animate-ping rounded-full bg-white"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </button>

      {/* 當前城市標籤 */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="font-pixel justif-center flex items-center rounded border border-cyan-500/50 bg-black/80 px-2 py-1 text-[10px] text-cyan-300">
          {currentCity}
        </span>
      </div>

      {/* 下拉選單 */}
      {isOpen && (
        <>
          {/* 背景遮罩 - 降低模糊度 */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsOpen(false)}
          />

          {/* 選單內容 - 像素風格 RPG 選單 */}
          <div className="absolute top-full left-0 z-50 mt-8 max-h-96 w-52 overflow-hidden rounded-lg border-4 border-yellow-400 bg-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
            {/* 裝飾角落 */}
            <div className="absolute top-0 left-0 -mt-0.5 -ml-0.5 h-3 w-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 -mt-0.5 -mr-0.5 h-3 w-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 -mb-0.5 -ml-0.5 h-3 w-3 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute right-0 bottom-0 -mr-0.5 -mb-0.5 h-3 w-3 border-r-2 border-b-2 border-cyan-400" />

            {/* 標題區 */}
            <div className="sticky top-0 z-10 border-b-2 border-yellow-400/60 bg-black px-3 py-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-yellow-400">▸</span>
                <p className="font-pixel text-[10px] tracking-wider text-yellow-400">
                  選擇傳送目的地
                </p>
                <span className="text-xs text-yellow-400">◂</span>
              </div>
            </div>

            {/* 城市列表 - 分區顯示 */}
            <div className="max-h-72 overflow-y-auto bg-slate-900/50">
              {TAIWAN_REGIONS.map((regionData) => (
                <div key={regionData.region} className="px-2 py-1.5">
                  {/* 區域標題 */}
                  <div className="mb-1.5 flex items-center gap-2 px-1">
                    <div className="h-px flex-1 bg-amber-500/40" />
                    <span className="font-pixel text-[9px] tracking-wide text-amber-400">
                      【{regionData.region}】
                    </span>
                    <div className="h-px flex-1 bg-amber-500/40" />
                  </div>

                  {/* 城市按鈕 */}
                  <div className="space-y-0.5">
                    {regionData.cities.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => handleCitySelect(city.name)}
                        className={`group/item flex w-full cursor-pointer items-center gap-2 px-2 py-1.5 transition-all duration-150 ${
                          currentCity === city.name
                            ? "border-l-4 border-cyan-400 bg-cyan-600/60"
                            : "border-l-4 border-transparent bg-transparent hover:border-yellow-400/50 hover:bg-slate-700/60"
                        }`}
                      >
                        {/* 選擇指示器 */}
                        <span
                          className={`font-pixel flex items-center justify-center text-[10px] transition-opacity ${currentCity === city.name ? "text-cyan-300" : "text-slate-600 group-hover/item:text-yellow-400"}`}
                        >
                          {currentCity === city.name ? "▶" : "　"}
                        </span>

                        {/* 城市圖標 */}
                        <span className="flex items-center justify-center text-sm">
                          {city.icon}
                        </span>

                        {/* 城市名稱 */}
                        <span
                          className={`font-pixel flex flex-1 items-center text-left text-[10px] ${
                            currentCity === city.name
                              ? "text-white"
                              : "text-slate-300 group-hover/item:text-yellow-200"
                          }`}
                        >
                          {city.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
