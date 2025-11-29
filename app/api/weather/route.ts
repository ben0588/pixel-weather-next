import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.CWA_API_KEY;

// 台灣縣市名稱對應（符合 API 的 LocationName 格式）
const cityLocationMap: Record<string, string> = {
  '台北': '臺北市',
  '台北市': '臺北市',
  '臺北': '臺北市',
  '臺北市': '臺北市',
  '新北': '新北市',
  '新北市': '新北市',
  '桃園': '桃園市',
  '桃園市': '桃園市',
  '台中': '臺中市',
  '台中市': '臺中市',
  '臺中': '臺中市',
  '臺中市': '臺中市',
  '台南': '臺南市',
  '台南市': '臺南市',
  '臺南': '臺南市',
  '臺南市': '臺南市',
  '高雄': '高雄市',
  '高雄市': '高雄市',
  '基隆': '基隆市',
  '基隆市': '基隆市',
  '新竹': '新竹市',
  '新竹市': '新竹市',
  '新竹縣': '新竹縣',
  '嘉義': '嘉義市',
  '嘉義市': '嘉義市',
  '嘉義縣': '嘉義縣',
  '宜蘭': '宜蘭縣',
  '宜蘭縣': '宜蘭縣',
  '花蓮': '花蓮縣',
  '花蓮縣': '花蓮縣',
  '臺東': '臺東縣',
  '臺東縣': '臺東縣',
  '台東': '臺東縣',
  '台東縣': '臺東縣',
  '澎湖': '澎湖縣',
  '澎湖縣': '澎湖縣',
  '苗栗': '苗栗縣',
  '苗栗縣': '苗栗縣',
  '彰化': '彰化縣',
  '彰化縣': '彰化縣',
  '南投': '南投縣',
  '南投縣': '南投縣',
  '雲林': '雲林縣',
  '雲林縣': '雲林縣',
  '屏東': '屏東縣',
  '屏東縣': '屏東縣',
  '金門': '金門縣',
  '金門縣': '金門縣',
  '連江': '連江縣',
  '連江縣': '連江縣',
};

// F-D0047-091 API 回傳的天氣元素介面
// 注意：ElementValue 陣列內容為動態屬性名稱，如 { Temperature: "20" } 或 { Weather: "多雲", WeatherCode: "04" }
interface WeatherElementTime {
  StartTime: string;
  EndTime: string;
  ElementValue: Array<Record<string, string>>;
}

interface WeatherElement {
  ElementName: string;
  Description?: string;
  Time: WeatherElementTime[];
}

interface LocationData {
  LocationName: string;
  Geocode: string;
  Latitude: string;
  Longitude: string;
  WeatherElement: WeatherElement[];
}

interface LocationsData {
  DatasetDescription: string;
  LocationsName: string;
  Dataid: string;
  Location: LocationData[];
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city') ?? '台北市';
    
    // 轉換城市名稱（符合 API 格式）
    const targetLocationName = cityLocationMap[city] ?? cityLocationMap['台北市'];
    
    // 檢查 API Key 是否存在
    if (!API_KEY) {
      console.warn('警告: CWA_API_KEY 未設定，返回預設天氣資料');
      const now = new Date();
      const hour = now.getHours();
      return NextResponse.json({
        city: targetLocationName,
        locationName: targetLocationName,
        temperature: 25,
        weather: '多雲',
        weatherCode: '02',
        humidity: 60,
        windSpeed: 2.0,
        isDay: hour >= 6 && hour < 18,
        observationTime: now.toISOString(),
        error: 'API Key 未設定，顯示預設資料'
      });
    }
    
    // 使用中央氣象署 鄉鎮天氣預報-臺灣未來1週天氣預報 API (F-D0047-091)
    // 不使用 elementName 參數，取得完整資料
    const url = `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-091?Authorization=${API_KEY}`;
    
    console.log('Fetching weather from:', url);
    
    const response = await fetch(url, {
      next: { revalidate: 600 } // ISR 快取 10 分鐘
    });
    
    if (!response.ok) {
      throw new Error(`API 請求失敗: ${response.status}`);
    }
    
    const data = await response.json();
    
    // F-D0047-091 的資料結構: records.Locations[0].Location[]
    const locationsData: LocationsData | undefined = data.records?.Locations?.[0];
    
    if (!locationsData?.Location) {
      console.log('無法找到天氣資料');
      return NextResponse.json({
        error: '找不到該地區的天氣資料',
        city: targetLocationName,
        temperature: 25,
        weather: '晴天',
        weatherCode: '01',
        humidity: 60,
        windSpeed: 2.0,
        isDay: true
      });
    }
    
    // 從所有縣市中找到目標縣市
    const location = locationsData.Location.find(
      (loc) => loc.LocationName === targetLocationName
    );
    
    if (!location) {
      console.log(`找不到 ${targetLocationName} 的天氣資料`);
      return NextResponse.json({
        error: `找不到 ${targetLocationName} 的天氣資料`,
        city: targetLocationName,
        temperature: 25,
        weather: '晴天',
        weatherCode: '01',
        humidity: 60,
        windSpeed: 2.0,
        isDay: true
      });
    }
    
    const weatherElements = location.WeatherElement;
    
    // 提取天氣資料的輔助函式
    // F-D0047-091 API 回傳格式：ElementName 是中文，ElementValue 陣列內是動態屬性
    // 例如：{ ElementName: "平均溫度", Time: [{ ElementValue: [{ Temperature: "20" }] }] }
    const getElementData = (elementNameChinese: string): Record<string, string> | null => {
      const element = weatherElements.find((e) => e.ElementName === elementNameChinese);
      if (!element?.Time?.[0]?.ElementValue?.[0]) return null;
      return element.Time[0].ElementValue[0];
    };
    
    // 取得特定元素的特定屬性值
    const getValue = (elementNameChinese: string, propertyName: string): string | null => {
      const data = getElementData(elementNameChinese);
      if (!data || !(propertyName in data)) return null;
      return data[propertyName];
    };
    
    const getNumericValue = (elementNameChinese: string, propertyName: string): number | null => {
      const value = getValue(elementNameChinese, propertyName);
      if (value === null || value === '-' || value === '') return null;
      const num = parseFloat(value);
      return isNaN(num) ? null : num;
    };
    
    // 從 API 提取各項天氣資料（使用中文 ElementName 和正確的屬性名稱）
    // 天氣現象: { Weather: "多雲", WeatherCode: "04" }
    const weather = getValue('天氣現象', 'Weather') ?? '多雲';
    const wxCode = getValue('天氣現象', 'WeatherCode') ?? '02';
    
    // 平均溫度: { Temperature: "20" }
    const temperature = getNumericValue('平均溫度', 'Temperature') ?? 25;
    
    // 平均相對濕度: { RelativeHumidity: "64" }
    const humidity = getNumericValue('平均相對濕度', 'RelativeHumidity') ?? 60;
    
    // 風速: { WindSpeed: "6", BeaufortScale: "4" }
    const windSpeed = getNumericValue('風速', 'WindSpeed') ?? 2.0;
    
    // 風向: { WindDirection: "偏東風" }
    const windDirection = getValue('風向', 'WindDirection') ?? '北';
    
    // 12小時降雨機率: { ProbabilityOfPrecipitation: "10" }
    const pop = getNumericValue('12小時降雨機率', 'ProbabilityOfPrecipitation') ?? 0;
    
    // 最高體感溫度: { MaxApparentTemperature: "19" }
    const apparentTemp = getNumericValue('最高體感溫度', 'MaxApparentTemperature') ?? temperature;
    
    // 最低溫度: { MinTemperature: "18" }
    const minTemp = getNumericValue('最低溫度', 'MinTemperature') ?? temperature - 3;
    
    // 最高溫度: { MaxTemperature: "21" }
    const maxTemp = getNumericValue('最高溫度', 'MaxTemperature') ?? temperature + 3;
    
    console.log(`=== ${location.LocationName} 實際資料 ===`);
    console.log(`  溫度: ${temperature}°C (${minTemp}~${maxTemp})`);
    console.log(`  天氣: ${weather} (代碼: ${wxCode})`);
    console.log(`  濕度: ${humidity}%`);
    console.log(`  風速: ${windSpeed} m/s ${windDirection}`);
    console.log(`  降雨機率: ${pop}%`);
    
    // 根據天氣現象代碼或描述推斷天氣代碼
    let weatherCode = wxCode;
    if (weather.includes('雨') || pop > 60) {
      weatherCode = '10'; // 雨天
    } else if (weather.includes('雪')) {
      weatherCode = '13'; // 雪天
    } else if (weather.includes('晴')) {
      weatherCode = '01'; // 晴天
    } else if (weather.includes('雲') || weather.includes('陰')) {
      weatherCode = '02'; // 多雲
    }
    
    // 判斷日夜
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 18;
    
    // 判斷是否為強風 (風速 > 10 m/s 視為強風)
    const isWindy = windSpeed > 10;
    
    // 判斷是否正在下雨 (降雨機率 > 70% 且天氣描述包含雨)
    const isRaining = pop > 70 || weather.includes('雨');
    
    console.log(`天氣資料: ${location.LocationName} - ${weather} ${temperature}°C`);
    
    return NextResponse.json({
      city: targetLocationName,
      locationName: location.LocationName,
      temperature: Math.round(temperature),
      minTemp: Math.round(minTemp),
      maxTemp: Math.round(maxTemp),
      apparentTemp: Math.round(apparentTemp),
      weather,
      weatherCode,
      humidity: Math.round(humidity),
      windSpeed: Math.round(windSpeed * 10) / 10,
      windDirection,
      pop, // 降雨機率
      isDay,
      isWindy,
      isRaining,
      observationTime: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('天氣 API 錯誤:', error);
    return NextResponse.json(
      {
        error: '無法獲取天氣資料',
        city: '臺北市',
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
