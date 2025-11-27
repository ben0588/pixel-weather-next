'use client';

import { useState, useEffect } from 'react';

interface LocationData {
  city: string;
  region: string;
  country: string;
  lat?: number;
  lon?: number;
  error?: string;
}

export function useIPLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocation() {
      try {
        setLoading(true);
        const response = await fetch('/api/location');
        
        if (!response.ok) {
          throw new Error('無法取得位置資訊');
        }
        
        const data = await response.json();
        setLocation(data);
        setError(null);
      } catch (err) {
        console.error('IP 定位錯誤:', err);
        setError('無法取得位置資訊');
        // 設定預設位置
        setLocation({
          city: '台北市',
          region: '台北市',
          country: '台灣'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, []);

  return { location, loading, error };
}
