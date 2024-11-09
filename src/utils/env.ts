import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVariables = [
  'OPENWEATHER_API_KEY',
  'GEOCODE_API_KEY',
  'AIRVISUAL_API_KEY'
];

// Check if all required variables are present
requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
