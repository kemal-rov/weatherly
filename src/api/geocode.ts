import axios from 'axios';

export const getGeographicDetails = async (cityName: string) => {
  try {

    const response = await axios.get(
      `https://geocode.xyz`,
      {
        params: {
          locate: cityName,
          json: '1',
          auth: process.env.GEOCODE_API_KEY
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching geographic details for ${cityName}:\n${error}`);
    throw error;
  }
};