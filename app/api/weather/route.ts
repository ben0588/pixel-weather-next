import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.CWA_API_KEY;

// 台灣主要城市的站點名稱對應
const cityStationMap: Record<string, string> = {
  '台北': '臺北',
  '台北市': '臺北',
  '新北': '新北',
  '新北市': '新北',
  '桃園': '桃園',
  '桃園市': '桃園',
  '台中': '臺中',
  '台中市': '臺中',
  '臺中': '臺中',
  '台南': '臺南',
  '台南市': '臺南',
  '臺南': '臺南',
  '高雄': '高雄',
  '高雄市': '高雄',
  '基隆': '基隆',
  '基隆市': '基隆',
  '新竹': '新竹',
  '新竹市': '新竹',
  '嘉義': '嘉義',
  '嘉義市': '嘉義',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') || '台北市';
    
    // 轉換城市名稱
    const stationName = cityStationMap[city] || cityStationMap['台北市'];
    
    // 使用中央氣象署的觀測資料 API
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${API_KEY}&locationName=${encodeURIComponent(stationName)}`;
    
    const response = await fetch(url, {
      next: { revalidate: 600 } // 快取 10 分鐘
    });
    
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 檢查是否有資料
    if (!data.records?.location?.[0]) {
      return NextResponse.json({
        error: '找不到該地區的天氣資料',
        city: stationName,
        temperature: 25,
        weather: '晴天',
        weatherCode: '01',
        humidity: 60,
        windSpeed: 2.0
      });
    }
    
    const location = data.records.location[0];
    const weatherElements = location.weatherElement;
    
    // 提取天氣資料
    const getElementValue = (name: string) => {
      const element = weatherElements.find((e: any) => e.elementName === name);
      return element?.elementValue || null;
    };
    
    const temp = parseFloat(getElementValue('TEMP')) || 25;
    const humidity = parseFloat(getElementValue('HUMD')) || 60;
    const windSpeed = parseFloat(getElementValue('WDSD')) || 0;
    const weather = getElementValue('WEATHER') || '多雲';
    
    // 根據天氣描述推斷天氣代碼
    let weatherCode = '01'; // 預設晴天
    if (weather.includes('雨')) {
      weatherCode = '10'; // 雨天
    } else if (weather.includes('雪')) {
      weatherCode = '13'; // 雪天
    } else if (weather.includes('雲') || weather.includes('陰')) {
      weatherCode = '02'; // 多雲
    } else if (weather.includes('晴')) {
      weatherCode = '01'; // 晴天
    }
    
    // 取得目前時間判斷日夜
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 18;
    
    return NextResponse.json({
      city: stationName,
      locationName: location.locationName,
      temperature: Math.round(temp),
      weather,
      weatherCode,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed * 10) / 10,
      isDay,
      observationTime: location.time?.obsTime || new Date().toISOString()
    });
    
  } catch (error) {
    console.error('天氣 API 錯誤:', error);
    return NextResponse.json(
      {
        error: '無法獲取天氣資料',
        city: '台北',
        temperature: 25,
        weather: '多雲',
        weatherCode: '02',
        humidity: 60,
        windSpeed: 2.0,
        isDay: true
      },
      { status: 200 }
    );
  }
}
