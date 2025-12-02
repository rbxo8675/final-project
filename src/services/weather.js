const WEATHER_API = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

/**
 * 좌표로 날씨 정보 가져오기
 * @param {number} lat - 위도
 * @param {number} lon - 경도
 * @param {string} units - 온도 단위 ('metric' 또는 'imperial')
 * @returns {Promise<Object>} 날씨 정보
 */
export const getWeatherByCoords = async (lat, lon, units = 'metric') => {
  try {
    const response = await fetch(
      `${WEATHER_API}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      city: data.name,
      country: data.sys.country,
    };
  } catch (error) {
    console.error('Failed to fetch weather by coordinates:', error);
    throw error;
  }
};

/**
 * 도시 이름으로 날씨 정보 가져오기
 * @param {string} city - 도시 이름
 * @param {string} units - 온도 단위 ('metric' 또는 'imperial')
 * @returns {Promise<Object>} 날씨 정보
 */
export const getWeatherByCity = async (city, units = 'metric') => {
  try {
    const response = await fetch(
      `${WEATHER_API}/weather?q=${city}&units=${units}&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      city: data.name,
      country: data.sys.country,
    };
  } catch (error) {
    console.error('Failed to fetch weather by city:', error);
    throw error;
  }
};

/**
 * 현재 위치 정보 가져오기 (Geolocation API)
 * @returns {Promise<Object>} 위도와 경도
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = 'Unknown location error';
        }
        reject(new Error(errorMessage));
      },
      {
        timeout: 10000,
        maximumAge: 300000, // 5분 캐시
      }
    );
  });
};
