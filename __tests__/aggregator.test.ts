import { aggregateCityData } from '../src/services/aggregator';
import { getCurrentWeather } from '../src/api/openWeather';
import { getGeographicDetails } from '../src/api/geocode';
import { getAirQualityByCoordinates } from '../src/api/airVisual';

// Mocking the functions
jest.mock('../api/openWeather');
jest.mock('../api/geocode');
jest.mock('../api/airVisual');

const mockedGetCurrentWeather = getCurrentWeather as jest.Mock;
const mockedGetGeographicDetails = getGeographicDetails as jest.Mock;
const mockedGetAirQualityByCoordinates = getAirQualityByCoordinates as jest.Mock;

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
        timezone: 'CET'
      },
      latt: '43.8564',
      longt: '18.4131'
    });

    mockedGetCurrentWeather.mockResolvedValue({
      main: {
        temp: 15,
        humidity: 70
      },
      wind: {
        speed: 3.6
      },
      weather: [
        { description: 'clear sky' }
      ]
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

    // Call the aggregator function
    const result = await aggregateCityData('Sarajevo');

    // Assertions
    expect(result).toEqual({
      city: 'Sarajevo',
      country: 'Bosnia and Herzegovina',
      timezone: 'CET',
      coordinates: {
        latitude: 43.8564,
        longitude: 18.4131
      },
      weather: {
        temperature: 15,
        humidity: 70,
        wind_speed: 3.6,
        weather_description: 'clear sky'
      },
      air_quality: {
        aqi: 42,
        main_pollutant: 'pm2.5',
        advice: 'Air quality is considered satisfactory, and air pollution poses little or no risk.'
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
