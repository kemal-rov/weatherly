import { getGeographicDetails } from '../api/geocode.js';
import { getAirQualityByCoordinates } from '../api/airVisual.js';
import { getCurrentWeather } from '../api/openWeather.js';
import { getAirQualityAdvice } from '../utils/aqiAdvice.js';

export const aggregateCityData = async (cityName: string) => {
  try {
    
    // Fetch geographic details
    const geoData = await getGeographicDetails(cityName);
    const latitude = parseFloat(geoData.latt);
    const longitude = parseFloat(geoData.longt);
    
    // Fetch weather and air quality data
    const [weatherData, airQualityData] = await Promise.all([
      getCurrentWeather(cityName),
      getAirQualityByCoordinates(latitude, longitude)
    ]);

    if (!weatherData || !airQualityData) {
        throw new Error(`Failed to fetch weather or air quality data for city: ${cityName}`);
    }

    // Build unified response
    const unifiedData = {
      city: geoData.standard.city,
      country: geoData.standard.countryname,
      timezone: geoData.standard.timezone,
      coordinates: {
        latitude,
        longitude
      },
      weather: {
        temperature: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        wind_speed: weatherData.wind.speed,
        weather_description: weatherData.weather[0].description
      },
      air_quality: {
        aqi: airQualityData.data.current.pollution.aqius,
        main_pollutant: airQualityData.data.current.pollution.mainus,
        advice: getAirQualityAdvice(airQualityData.data.current.pollution.aqius),
      }
    };

    return unifiedData;
  } catch (error) {
    console.error(`Error aggregating data for ${cityName}:\n${error}`);
    throw error;
  }
};
