import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "像素天氣日誌 | Pixel Weather",
  description: "探索台灣各地天氣！像素風格的即時天氣查詢應用，結合復古 RPG 遊戲風格與中央氣象署資料，讓查天氣變成一場冒險。",
  keywords: ["天氣", "台灣天氣", "像素風格", "Pixel Art", "天氣預報", "RPG", "氣象", "Taiwan Weather"],
  authors: [{ name: "Pixel Weather Team" }],
  creator: "Pixel Weather",
  publisher: "Pixel Weather",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  // Open Graph - Facebook, LINE, Discord 等社群分享
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: '像素天氣日誌',
    title: '像素天氣日誌 | Pixel Weather',
    description: '探索台灣各地天氣！像素風格的即時天氣查詢應用，結合復古 RPG 遊戲風格與中央氣象署資料，讓查天氣變成一場冒險。',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: '像素天氣日誌 - 台灣天氣查詢',
      },
    ],
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: '像素天氣日誌 | Pixel Weather',
    description: '探索台灣各地天氣！像素風格的即時天氣查詢應用，結合復古 RPG 遊戲風格與中央氣象署資料。',
    images: ['/og-image.svg'],
  },
  // 其他 meta
  other: {
    'theme-color': '#1e293b',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${pressStart2P.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
