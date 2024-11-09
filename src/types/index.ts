export interface WeatherResponse {
    temperature: number;
    humidity: number;
    wind_speed: number;
    weather_description: string;
  }
  
  export interface GeoResponse {
    city: string;
    country: string;
    timezone: string;
    latitude: number;
    longitude: number;
  }
  
  export interface AirQualityResponse {
    aqi: number;
    main_pollutant: string;
    advice: string;
  }
  
  export interface UnifiedResponse {
    city: string;
    country: string;
    timezone: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    weather: WeatherResponse;
    air_quality: AirQualityResponse;
  }
  