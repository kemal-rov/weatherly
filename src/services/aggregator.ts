// import { getCurrentWeather } from '../api/openWeather';
// import { getGeographicDetails } from '../api/geocode';
// import { getAirQuality } from '../api/airVisual';
// import { UnifiedResponse } from '../types';

// export const aggregateCityData = async (cityName: string): Promise<UnifiedResponse> => {
//   try {
//     const [weatherData, geoData, airQualityData] = await Promise.all([
//       getCurrentWeather(cityName),
//       getGeographicDetails(cityName),
//       getAirQuality(cityName)
//     ]);

//     const unifiedData: UnifiedResponse = {
//       city: geoData.city,
//       country: geoData.country,
//       timezone: geoData.timezone,
//       coordinates: {
//         latitude: geoData.latitude,
//         longitude: geoData.longitude
//       },
//       weather: {
//         temperature: weatherData.main.temp,
//         humidity: weatherData.main.humidity,
//         wind_speed: weatherData.wind.speed,
//         weather_description: weatherData.weather[0].description
//       },
//       air_quality: {
//         aqi: airQualityData.data.current.pollution.aqius,
//         main_pollutant: airQualityData.data.current.pollution.mainus,
//         advice: getAirQualityAdvice(airQualityData.data.current.pollution.aqius)
//       }
//     };

//     return unifiedData;
//   } catch (error) {
//     console.error(`Error aggregating data for ${cityName}:`, error);
//     throw error;
//   }
// };
