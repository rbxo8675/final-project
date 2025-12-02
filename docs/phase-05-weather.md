# Phase 5: 날씨

## 목표
OpenWeatherMap API를 사용하여 현재 위치 기반 날씨 정보를 표시합니다.

## 작업 내용

### 1. OpenWeatherMap API 서비스 생성
`src/services/weather.js` 파일 생성

#### API 설정
```javascript
const WEATHER_API = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;
```

#### 구현할 함수
```javascript
// 좌표로 날씨 가져오기
export const getWeatherByCoords = async (lat, lon, units = 'metric') => {
  const response = await fetch(
    `${WEATHER_API}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`
  );
  const data = await response.json();

  return {
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    city: data.name,
    country: data.sys.country
  };
};

// 도시 이름으로 날씨 가져오기
export const getWeatherByCity = async (city, units = 'metric') => {
  const response = await fetch(
    `${WEATHER_API}/weather?q=${city}&units=${units}&appid=${API_KEY}`
  );
  const data = await response.json();
  // 위와 동일한 형식으로 반환
};
```

### 2. 위치 정보 가져오기
Geolocation API 사용

```javascript
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};
```

### 3. Weather 컴포넌트 생성
`src/components/Weather/Weather.jsx`와 `Weather.module.css` 생성

#### 컴포넌트 구조
```javascript
const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { weatherUnit, language } = useSettings();

  useEffect(() => {
    loadWeather();
  }, [weatherUnit]);

  const loadWeather = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      const data = await getWeatherByCoords(
        position.lat,
        position.lon,
        weatherUnit
      );
      setWeather(data);
    } catch (err) {
      setError(err.message);
      // 기본 도시로 폴백 (예: Seoul)
      const data = await getWeatherByCity('Seoul', weatherUnit);
      setWeather(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loader}>Loading weather...</div>;
  if (error && !weather) return <div className={styles.error}>Weather unavailable</div>;

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
          {weather.temperature}°{weatherUnit === 'metric' ? 'C' : 'F'}
        </div>
      </div>
      <div className={styles.description}>
        {translateDescription(weather.description, language)}
      </div>
      <div className={styles.details}>
        <div>체감: {weather.feelsLike}°</div>
        <div>습도: {weather.humidity}%</div>
        <div>풍속: {weather.windSpeed} m/s</div>
      </div>
      <button onClick={loadWeather} className={styles.refreshBtn}>
        새로고침
      </button>
    </div>
  );
};
```

### 4. 날씨 설명 번역
`src/utils/weatherTranslations.js`

```javascript
const weatherTranslations = {
  ko: {
    'clear sky': '맑음',
    'few clouds': '구름 조금',
    'scattered clouds': '구름 많음',
    'broken clouds': '흐림',
    'shower rain': '소나기',
    'rain': '비',
    'thunderstorm': '천둥번개',
    'snow': '눈',
    'mist': '안개',
    // 더 많은 번역 추가
  },
  en: {
    // 영어는 그대로 사용
  }
};

export const translateDescription = (description, language) => {
  if (language === 'en') return description;
  return weatherTranslations.ko[description] || description;
};
```

### 5. CSS 스타일링
`Weather.module.css`

#### 주요 스타일
- 카드 형태 디자인
- 반투명 배경 (backdrop-filter)
- 날씨 아이콘 크기 조정
- 온도 큰 글씨
- 상세 정보 그리드 레이아웃
- 새로고침 버튼

### 6. 온도 단위 변환
설정에서 섭씨(metric)/화씨(imperial) 전환

```javascript
const convertTemperature = (temp, fromUnit, toUnit) => {
  if (fromUnit === toUnit) return temp;
  if (toUnit === 'imperial') {
    return Math.round((temp * 9/5) + 32);
  } else {
    return Math.round((temp - 32) * 5/9);
  }
};
```

### 7. App.js에 Weather 추가
```javascript
import Weather from './components/Weather/Weather';

function App() {
  const { widgets } = useSettings();

  return (
    <AppProvider>
      <Background />
      {widgets.clock.enabled && <Clock />}
      {widgets.weather.enabled && <Weather />}
      {/* 다른 컴포넌트들 */}
    </AppProvider>
  );
}
```

## 완료 조건
- [ ] 위치 정보 권한 요청이 작동함
- [ ] 현재 위치 기반 날씨가 표시됨
- [ ] 위치 권한 거부 시 기본 도시로 폴백
- [ ] 날씨 아이콘이 정상 표시됨
- [ ] 온도, 습도, 풍속 등 상세 정보 표시
- [ ] 섭씨/화씨 전환이 가능함
- [ ] 날씨 설명이 한글/영어로 번역됨
- [ ] 에러 처리가 구현됨

## 주의사항
- OpenWeatherMap 무료 플랜: 1분당 60 요청 제한
- 위치 권한: HTTPS 환경에서만 작동
- 브라우저 호환성: Geolocation API 지원 확인
- 캐싱: 너무 자주 API 호출하지 않도록 주의 (예: 10분마다 업데이트)

## 개선 아이디어
- [ ] 주간 예보 추가
- [ ] 시간별 예보 추가
- [ ] 날씨에 따른 배경 색상 변경
- [ ] 캐싱으로 API 호출 최소화

## 다음 단계
Phase 6: 성경/명언 구현
