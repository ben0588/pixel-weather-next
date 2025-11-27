import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 從請求標頭中獲取客戶端 IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '1.1.1.1';
    
    // 使用 ip-api.com 免費服務
    const response = await fetch(`http://ip-api.com/json/${ip}?lang=zh-TW`);
    
    if (!response.ok) {
      throw new Error('無法獲取位置資訊');
    }
    
    const data = await response.json();
    
    if (data.status === 'fail') {
      return NextResponse.json(
        { error: '無法解析 IP 位置', city: '台北市', region: '台北市' },
        { status: 200 }
      );
    }
    
    return NextResponse.json({
      city: data.city || '台北市',
      region: data.regionName || '台北市',
      country: data.country || '台灣',
      lat: data.lat,
      lon: data.lon
    });
    
  } catch (error) {
    console.error('IP 定位錯誤:', error);
    return NextResponse.json(
      { 
        error: '無法獲取位置', 
        city: '台北市',
        region: '台北市',
        country: '台灣'
      },
      { status: 200 }
    );
  }
}
