# Phase 4: 시계/날짜

## 목표
실시간으로 업데이트되는 시계와 날짜를 표시하며, 세 가지 스타일을 지원합니다.

## 작업 내용

### 1. Clock 컴포넌트 생성
`src/components/Clock/Clock.jsx`와 `Clock.module.css` 생성

#### 컴포넌트 구조
```javascript
const Clock = () => {
  const [time, setTime] = useState(new Date());
  const { widgets, language } = useSettings();
  const clockStyle = widgets.clock.style; // 'digital-large' | 'analog' | 'digital-small'

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 스타일에 따라 다른 컴포넌트 렌더링
  return (
    <div className={styles.clockContainer}>
      {clockStyle === 'digital-large' && <DigitalLarge time={time} language={language} />}
      {clockStyle === 'analog' && <Analog time={time} />}
      {clockStyle === 'digital-small' && <DigitalSmall time={time} language={language} />}
    </div>
  );
};
```

### 2. 디지털 시계 (대) - DigitalLarge
`src/components/Clock/DigitalLarge.jsx`

#### 구현 내용
```javascript
const DigitalLarge = ({ time, language }) => {
  const formatTime = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = () => {
    if (language === 'ko') {
      const year = time.getFullYear();
      const month = time.getMonth() + 1;
      const date = time.getDate();
      const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      const day = days[time.getDay()];
      return `${year}년 ${month}월 ${date}일 ${day}`;
    } else {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return time.toLocaleDateString('en-US', options);
    }
  };

  return (
    <div className={styles.digitalLarge}>
      <div className={styles.time}>{formatTime()}</div>
      <div className={styles.date}>{formatDate()}</div>
    </div>
  );
};
```

#### CSS 스타일
- 큰 폰트 사이즈 (시간: 96px, 날짜: 24px)
- 중앙 정렬
- 부드러운 폰트 (예: 'Roboto', 'Noto Sans KR')

### 3. 아날로그 시계 - Analog
`src/components/Clock/Analog.jsx`

#### 구현 내용
```javascript
const Analog = ({ time }) => {
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = ((minutes + seconds / 60) / 60) * 360;
  const hourDeg = ((hours + minutes / 60) / 12) * 360;

  return (
    <div className={styles.analogClock}>
      <div className={styles.clockFace}>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${secondDeg}deg)` }}
        />
        <div className={styles.center} />
      </div>
    </div>
  );
};
```

#### CSS 스타일
- 원형 시계판 (200px x 200px)
- 시침, 분침, 초침 디자인
- 중앙 점
- 시계 테두리

### 4. 디지털 시계 (소) - DigitalSmall
`src/components/Clock/DigitalSmall.jsx`

#### 구현 내용
```javascript
const DigitalSmall = ({ time, language }) => {
  const formatTime = () => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = () => {
    if (language === 'ko') {
      const year = time.getFullYear();
      const month = (time.getMonth() + 1).toString().padStart(2, '0');
      const date = time.getDate().toString().padStart(2, '0');
      return `${year}.${month}.${date}`;
    } else {
      return time.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  };

  return (
    <div className={styles.digitalSmall}>
      <span className={styles.time}>{formatTime()}</span>
      <span className={styles.date}>{formatDate()}</span>
    </div>
  );
};
```

#### CSS 스타일
- 작은 폰트 사이즈 (시간: 24px, 날짜: 14px)
- 인라인 디스플레이
- 모서리 또는 상단에 배치

### 5. 유틸리티 함수 (선택사항)
`src/utils/dateTime.js`

```javascript
export const formatTime = (date, includeSeconds = false) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return includeSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
};

export const formatDate = (date, language = 'ko') => {
  // 날짜 포맷팅 로직
};
```

### 6. App.js에 Clock 추가
```javascript
import Clock from './components/Clock/Clock';

function App() {
  const { widgets } = useSettings();

  return (
    <AppProvider>
      <Background />
      {widgets.clock.enabled && <Clock />}
      {/* 다른 컴포넌트들 */}
    </AppProvider>
  );
}
```

## 완료 조건
- [ ] 시계가 1초마다 정확하게 업데이트됨
- [ ] 세 가지 스타일이 모두 구현됨
- [ ] 날짜가 한글/영문으로 표시됨
- [ ] 아날로그 시계의 바늘이 부드럽게 움직임
- [ ] 메모리 누수 없음 (컴포넌트 언마운트 시 타이머 정리)

## 주의사항
- `setInterval` 정리: useEffect cleanup 함수에서 `clearInterval` 필수
- 성능 최적화: 불필요한 리렌더링 방지
- 아날로그 시계: CSS transform 사용으로 부드러운 애니메이션

## 다음 단계
Phase 5: 날씨 구현
