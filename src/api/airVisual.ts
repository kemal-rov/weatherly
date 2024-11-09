import axios from 'axios';

// Function to get Air Quality from AirVisual API using latitude and longitude
export const getAirQualityByCoordinates = async (latitude: number, longitude: number) => {
  try {
    console.log(`Attempting to fetch air quality data for coordinates (${latitude}, ${longitude})`);
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
    console.log(`Received air quality data for coordinates (${latitude}, ${longitude}):`, response.data);
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
