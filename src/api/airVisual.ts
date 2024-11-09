import axios from 'axios';

export const getAirQuality = async (cityName: string) => {
    try {

        const response = await axios.get(
        `https://api.airvisual.com/v2/city`,
        {
          params: {
            city: cityName,
            key: process.env.AIRVISUAL_API_KEY
          }
        }
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error(`Error fetching air quality data for ${cityName}:\n${error}`);
      throw error;
    }
  };