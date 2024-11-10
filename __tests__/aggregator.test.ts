import { aggregateCityData } from '../src/services/aggregator';
import { getCurrentWeather } from '../src/api/openWeather';
import { getGeographicDetails } from '../src/api/geocode';
import { getAirQualityByCoordinates } from '../src/api/airVisual';
import { getAqiCategory } from '../src/utils/aqiCategory';
import { getAirQualityAdvice } from '../src/utils/aqiAdvice';

// Mocking the functions
jest.mock('../src/api/openWeather');
jest.mock('../src/api/geocode');
jest.mock('../src/api/airVisual');
jest.mock('../src/utils/aqiCategory');
jest.mock('../src/utils/aqiAdvice');

const mockedGetCurrentWeather = getCurrentWeather as jest.Mock;
const mockedGetGeographicDetails = getGeographicDetails as jest.Mock;
const mockedGetAirQualityByCoordinates = getAirQualityByCoordinates as jest.Mock;
const mockedGetAqiCategory = getAqiCategory as jest.Mock;
const mockedGetAirQualityAdvice = getAirQualityAdvice as jest.Mock;

describe('aggregateCityData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return aggregated data for a valid city', async () => {
    // Mocking the API responses
    mockedGetGeographicDetails.mockResolvedValue({
      standard: {
        city: 'Sarajevo',
        countryname: 'Bosnia and Herzegovina',
        timezone: 'Europe/Belgrade'
      },
      latt: '43.8564',
      longt: '18.4131'
    });

    mockedGetCurrentWeather.mockResolvedValue({
      main: {
        temp: 15,
        feels_like: 13,
        temp_min: 10,
        temp_max: 18,
        humidity: 70,
        pressure: 1015
      },
      visibility: 10000,
      wind: {
        speed: 3.6
      },
      weather: [
        { description: 'clear sky' }
      ],
      sys: {
        sunrise: 1731216896,
        sunset: 1731252373
      }
    });

    mockedGetAirQualityByCoordinates.mockResolvedValue({
      data: {
        current: {
          pollution: {
            aqius: 42,
            mainus: 'pm2.5'
          }
        }
      }
    });

    mockedGetAqiCategory.mockReturnValue('Good');
    mockedGetAirQualityAdvice.mockReturnValue('Air quality is considered satisfactory, and air pollution poses little or no risk.');

    // Call the aggregator function
    const result = await aggregateCityData('Sarajevo');

    const mockedSunrise = new Date(1731216896 * 1000).toLocaleTimeString('en-GB');
    const mockedSunset = new Date(1731252373 * 1000).toLocaleTimeString('en-GB');

    // Assertions
    expect(result).toEqual({
      city: 'Sarajevo',
      city_code: 'Sarajevo',
      country: 'Bosnia and Herzegovina',
      timezone: 'Europe/Belgrade',
      coordinates: {
        latitude: 43.8564,
        longitude: 18.4131
      },
      weather: {
        temperature: 15,
        feels_like: 13,
        min_temperature: 10,
        max_temperature: 18,
        humidity: 70,
        pressure: 1015,
        visibility: 10000,
        wind_speed: 3.6,
        weather_description: 'clear sky'
      },
      air_quality: {
        aqi: 42,
        aqi_category: 'Good',
        main_pollutant: 'pm2.5',
        advice: 'Air quality is considered satisfactory, and air pollution poses little or no risk.'
      },
      sun: {
        sunrise: mockedSunrise,
        sunset: mockedSunset
      }
    });
  });

  it('should throw an error if geographic details are not found', async () => {
    // Mocking the API responses
    mockedGetGeographicDetails.mockResolvedValue(null);

    // Expect the function to throw an error
    await expect(aggregateCityData('UnknownCity')).rejects.toThrow('Geographic details not found for city: UnknownCity');
  });

  it('should throw an error if weather or air quality data is missing', async () => {
    // Mocking the API responses
    mockedGetGeographicDetails.mockResolvedValue({
      standard: {
        city: 'Sarajevo',
        countryname: 'Bosnia and Herzegovina',
        timezone: 'CET'
      },
      latt: '43.8564',
      longt: '18.4131'
    });

    mockedGetCurrentWeather.mockResolvedValue(null);
    mockedGetAirQualityByCoordinates.mockResolvedValue(null);

    // Expect the function to throw an error
    await expect(aggregateCityData('Sarajevo')).rejects.toThrow('Failed to fetch weather or air quality data for city: Sarajevo');
  });
});
