import axios from 'axios';

export const getAirQualityByCoordinates = async (latitude: number, longitude: number) => {
  try {

    const response = await axios.get(
      `https://api.airvisual.com/v2/nearest_city`,
      {
        params: {
          lat: latitude,
          lon: longitude,
          key: process.env.AIRVISUAL_API_KEY
        }
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error(`Error fetching air quality data for coordinates (${latitude}, ${longitude}):\n${error.response.data}`);
    } else {
      console.error(`Network or other error occurred: ${error.message}`);
    }
    throw error;
  }
};
