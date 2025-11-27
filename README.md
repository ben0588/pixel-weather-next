# 勇者的天氣日誌 | Pixel Weather RPG

一個使用 Next.js 和 Tailwind CSS 建立的像素風格天氣查詢 RPG 體驗。

![像素風格天氣應用程式](https://img.shields.io/badge/Next.js-16.0.5-black) ![React](https://img.shields.io/badge/React-19.2.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.x-cyan)

## 🎮 功能特點

- **RPG 風格介面**：像素風格的視覺設計，帶有傳統 RPG 對話框
- **即時天氣資料**：整合中央氣象署開放資料平台
- **IP 自動定位**：自動偵測使用者位置並顯示當地天氣
- **城市選擇器**：傳送點風格的城市選單，支援台灣主要城市
- **動態背景**：根據時間（早/中/晚）自動切換色調
- **角色狀態**：角色會根據天氣狀況改變（下雨撐傘、炎熱戴墨鏡、寒冷穿厚衣）
- **天氣特效**：下雨、下雪、大太陽、風等視覺特效
- **打字機效果**：RPG 風格的文字顯示動畫

## 🚀 快速開始

### 安裝相依套件

```bash
npm install
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟瀏覽器前往 [http://localhost:3000](http://localhost:3000) 查看應用程式。

## 📁 專案結構

```
app/
├── api/
│   ├── location/      # IP 定位 API
│   └── weather/       # 天氣資料 API (中央氣象署)
├── components/
│   ├── WeatherStage/  # 天氣舞台組件
│   │   ├── Stage.tsx
│   │   ├── Character.tsx
│   │   ├── WeatherEffects.tsx
│   │   └── Background.tsx
│   ├── DialogBox/     # RPG 對話框組件
│   │   ├── DialogBox.tsx
│   │   └── Typewriter.tsx
│   └── LocationMenu/  # 城市選擇選單
│       └── LocationMenu.tsx
├── hooks/
│   ├── useWeather.ts  # 天氣資料 Hook
│   └── useIPLocation.ts # IP 定位 Hook
├── globals.css        # 全域樣式（包含像素風格動畫）
├── layout.tsx         # 根佈局（像素字體設定）
└── page.tsx           # 主頁面
```

## 🌦️ 天氣狀態對應

| 天氣條件 | 角色狀態 | RPG 提示訊息 |
|---------|---------|------------|
| 晴天 | 一般狀態 😎 | 適合出發冒險的日子！體力恢復速度 +10% |
| 雨天 | 撐傘狀態 ☔ | 道路泥濘，建議在旅店休息（帶把傘吧） |
| 雪天 | 穿厚裝備 🧥 | 這是冰霜巨龍的氣息嗎？記得多穿一件裝備 |
| 高溫 (>30°C) | 戴墨鏡 😎 | 烈日當空！記得補充水分，小心中暑狀態 |
| 低溫 (<15°C) | 發抖動畫 🧥 | 寒風刺骨，裝備保暖道具可提升防禦力 |

## 🎨 CSS 動畫效果

- **雨滴動畫**：從上往下掉落的雨滴
- **雪花動畫**：旋轉飄落的雪花 ❄️
- **風的特效**：橫向飛過的風線
- **角色動畫**：發抖、待機、緩慢彈跳
- **雲朵飄動**：浮動的像素雲朵
- **星星閃爍**：夜晚的星空特效

## 🔧 技術棧

- **框架**：Next.js 16.0.5 (App Router)
- **UI 庫**：React 19.2.0
- **樣式**：Tailwind CSS 4.x
- **語言**：TypeScript 5.x
- **字體**：Press Start 2P (Google Fonts)

## 📍 支援的城市

台北市、新北市、桃園市、台中市、台南市、高雄市、基隆市、新竹市、嘉義市

## 🌐 使用的 API

### 中央氣象署開放資料平台

- **API 文件**：https://opendata.cwa.gov.tw/dist/opendata-swagger.html
- **授權碼**：CWA-60A22FD0-9063-40AE-8226-F97AA3087653
- **使用的 API**：自動氣象站-氣象觀測資料 (O-A0003-001)

### IP 定位 API

- **服務**：ip-api.com
- **說明**：用於自動偵測使用者所在城市

## 🛠️ 建置與部署

### 建置生產版本

```bash
npm run build
```

### 啟動生產伺服器

```bash
npm start
```

### 部署到 Vercel

此專案可以直接部署到 Vercel，連接到 GitHub 倉庫即可自動部署。

## 💡 自訂與擴展

### 新增城市

編輯 `app/components/LocationMenu/LocationMenu.tsx` 中的 `TAIWAN_CITIES` 陣列。

### 修改天氣訊息

編輯 `app/components/DialogBox/DialogBox.tsx` 中的 `getWeatherPrompt()` 函數。

### 更換角色圖片

目前使用 emoji 作為臨時圖像。可以在 `app/components/WeatherStage/Character.tsx` 中替換為真正的像素藝術圖片。建議從 [Itch.io](https://itch.io/game-assets/free/tag-pixel-art) 尋找免費的像素藝術素材。

## 📝 授權

此專案僅供學習和個人使用。天氣資料來自中央氣象署開放資料平台。

## 🙏 致謝

- 中央氣象署開放資料平台
- Google Fonts (Press Start 2P)
- Next.js & Vercel
- Tailwind CSS

---

**Powered by Next.js & Tailwind CSS** 🚀

# pixel-weather-next
