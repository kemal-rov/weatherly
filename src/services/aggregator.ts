import { getGeographicDetails } from '../api/geocode.js';
import { getAirQualityByCoordinates } from '../api/airVisual.js';
import { getCurrentWeather } from '../api/openWeather.js';
import { getAirQualityAdvice } from '../utils/aqiAdvice.js';
import { getAqiCategory } from '../utils/aqiCategory.js';
import { find } from 'geo-tz';

export const aggregateCityData = async (cityName: string) => {
  try {
    // Fetch geographic details
    const geoData = await getGeographicDetails(cityName);
    if (!geoData) {
      throw new Error(`Geographic details not found for city: ${cityName}`);
    }
    const latitude = parseFloat(geoData.latt);
    const longitude = parseFloat(geoData.longt);
    const timezone = find(latitude, longitude)[0];
    const cityCode = geoData.standard.city; // Codename (e.g., "Sjj")
    const city = cityName; // City name (e.g., "Sarajevo")
    
    // Fetch weather and air quality data
    const [weatherData, airQualityData] = await Promise.all([
      getCurrentWeather(cityName),
      getAirQualityByCoordinates(latitude, longitude)
    ]);

    if (!weatherData || !airQualityData) {
      throw new Error(`Failed to fetch weather or air quality data for city: ${cityName}`);
    }

    // Get AQI value and related info
    const aqi = airQualityData.data.current.pollution.aqius;
    const aqiCategory = getAqiCategory(aqi);
    const aqiAdvice = getAirQualityAdvice(aqi);

    // Build unified response
    const unifiedData = {
      city,
      city_code: cityCode,
      country: geoData.standard.countryname,
      timezone,
      coordinates: {
        latitude,
        longitude
      },
      weather: {
        temperature: weatherData.main.temp,
        feels_like: weatherData.main.feels_like,
        min_temperature: weatherData.main.temp_min,
        max_temperature: weatherData.main.temp_max,
        humidity: weatherData.main.humidity,
        pressure: weatherData.main.pressure,
        visibility: weatherData.visibility,
        wind_speed: weatherData.wind.speed,
        weather_description: weatherData.weather[0].description
      },
      air_quality: {
        aqi,
        aqi_category: aqiCategory,
        main_pollutant: airQualityData.data.current.pollution.mainus,
        advice: aqiAdvice
      },
      sun: {
        sunrise: new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-GB'),
        sunset: new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-GB')
      }
    };
    
    return unifiedData;
  } catch (error) {
    console.error(`Error aggregating data for ${cityName}:\n${error}`);
    throw error;
  }
};
