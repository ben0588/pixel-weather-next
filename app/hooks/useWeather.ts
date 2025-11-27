'use client';

import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
  city: string;
  locationName?: string;
  temperature: number;
  weather: string;
  weatherCode: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
  observationTime?: string;
  error?: string;
}

export function useWeather(initialCity: string = '台北市') {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState(initialCity);

  const fetchWeather = useCallback(async (city: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      
      if (!response.ok) {
        throw new Error('無法取得天氣資訊');
      }
      
      const data = await response.json();
      setWeatherData(data);
      setError(null);
    } catch (err) {
      console.error('天氣 API 錯誤:', err);
      setError('無法取得天氣資訊');
      // 設定預設天氣
      setWeatherData({
        city,
        temperature: 25,
        weather: '多雲',
        weatherCode: '02',
        humidity: 60,
        windSpeed: 2.0,
        isDay: true
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentCity) {
      fetchWeather(currentCity);
    }
  }, [currentCity, fetchWeather]);

  const updateCity = useCallback((newCity: string) => {
    setCurrentCity(newCity);
  }, []);

  const refresh = useCallback(() => {
    fetchWeather(currentCity);
  }, [currentCity, fetchWeather]);

  return { 
    weatherData, 
    loading, 
    error, 
    updateCity,
    refresh,
    currentCity 
  };
}
