export const getAirQualityAdvice = (aqi: number): string => {
    if (aqi <= 50) {
      return "Air quality is considered satisfactory, and air pollution poses little or no risk.";
    } else if (aqi <= 100) {
      return "Air quality is acceptable; however, some pollutants may be a concern for sensitive groups.";
    } else if (aqi <= 150) {
      return "Members of sensitive groups may experience health effects. The general public is not likely to be affected.";
    } else if (aqi <= 200) {
      return "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
    } else if (aqi <= 300) {
      return "Health alert: everyone may experience more serious health effects.";
    } else {
      return "Health warnings of emergency conditions. The entire population is likely to be affected.";
    }
  };
  