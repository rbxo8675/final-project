import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { getWeatherByCoords, getWeatherByCity, getCurrentPosition } from '../../services/weather';
import styles from './Weather.module.css';

const Weather = () => {
  const { weatherUnit = 'metric', language = 'ko' } = useSettings();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherUnit]);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      // 먼저 위치 정보 가져오기 시도
      const position = await getCurrentPosition();
      const data = await getWeatherByCoords(position.lat, position.lon, weatherUnit);
      setWeather(data);
    } catch (err) {
      console.error('Weather error:', err);
      setError(err.message);

      // 위치 권한이 없으면 기본 도시로 폴백
      try {
        const defaultCity = language === 'ko' ? 'Seoul' : 'New York';
        const data = await getWeatherByCity(defaultCity, weatherUnit);
        setWeather(data);
      } catch (fallbackErr) {
        console.error('Fallback weather error:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const translateDescription = (description) => {
    const translations = {
      'clear sky': '맑음',
      'few clouds': '구름 조금',
      'scattered clouds': '구름 많음',
      'broken clouds': '흐림',
      'overcast clouds': '흐림',
      'shower rain': '소나기',
      'rain': '비',
      'light rain': '가벼운 비',
      'moderate rain': '보통 비',
      'heavy intensity rain': '폭우',
      'thunderstorm': '천둥번개',
      'snow': '눈',
      'light snow': '가벼운 눈',
      'mist': '안개',
      'smoke': '연무',
      'haze': '실안개',
      'dust': '먼지',
      'fog': '안개',
      'sand': '모래',
      'ash': '화산재',
      'squall': '돌풍',
      'tornado': '토네이도',
    };

    if (language === 'en') return description;
    return translations[description.toLowerCase()] || description;
  };

  if (loading) {
    return (
      <div className={styles.weatherContainer}>
        <div className={styles.loader}>날씨 불러오는 중...</div>
      </div>
    );
  }

  if (error && !weather) {
    return (
      <div className={styles.weatherContainer}>
        <div className={styles.error}>날씨를 불러올 수 없습니다</div>
        <button onClick={loadWeather} className={styles.retryBtn}>
          다시 시도
        </button>
      </div>
    );
  }

  if (!weather) return null;

  const tempUnit = weatherUnit === 'metric' ? 'C' : 'F';
  const speedUnit = weatherUnit === 'metric' ? 'm/s' : 'mph';

  return (
    <div className={styles.weatherContainer}>
      <div className={styles.location}>
        {weather.city}, {weather.country}
      </div>

      <div className={styles.mainInfo}>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className={styles.icon}
        />
        <div className={styles.temperature}>
          {weather.temperature}°{tempUnit}
        </div>
      </div>

      <div className={styles.description}>
        {translateDescription(weather.description)}
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.label}>체감</span>
          <span className={styles.value}>{weather.feelsLike}°</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>습도</span>
          <span className={styles.value}>{weather.humidity}%</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.label}>풍속</span>
          <span className={styles.value}>{weather.windSpeed} {speedUnit}</span>
        </div>
      </div>

      <button onClick={loadWeather} className={styles.refreshBtn} title="새로고침">
        🔄
      </button>
    </div>
  );
};

export default Weather;
