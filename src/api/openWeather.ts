import axios from 'axios';

export const getCurrentWeather = async (cityName: string) => {
  try {
        
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          q: cityName,
          appid: process.env.OPENWEATHER_API_KEY,
          units: 'metric'
        }
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching current weather for ${cityName}:\n${error}`);
    throw error;
  }
};
