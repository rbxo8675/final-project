# Phase 3: 배경 이미지

## 목표
Unsplash API를 연동하여 새로고침마다 새로운 배경 이미지를 표시합니다.

## 작업 내용

### 1. Unsplash API 서비스 생성
`src/services/unsplash.js` 파일 생성

#### API 엔드포인트
```javascript
const UNSPLASH_API = 'https://api.unsplash.com';
const ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
```

#### 구현할 함수
```javascript
// 랜덤 이미지 가져오기
export const getRandomImage = async (category = 'nature') => {
  const response = await fetch(
    `${UNSPLASH_API}/photos/random?query=${category}&client_id=${ACCESS_KEY}`
  );
  const data = await response.json();
  return {
    url: data.urls.full,
    author: data.user.name,
    authorLink: data.user.links.html,
    downloadLocation: data.links.download_location
  };
};

// 다운로드 트리거 (Unsplash API 가이드라인)
export const triggerDownload = async (downloadLocation) => {
  await fetch(`${downloadLocation}?client_id=${ACCESS_KEY}`);
};
```

### 2. Background 컴포넌트 생성
`src/components/Background/Background.jsx`와 `Background.module.css` 생성

#### 컴포넌트 구조
```javascript
const Background = () => {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { widgets } = useSettings();

  useEffect(() => {
    loadImage();
  }, []);

  const loadImage = async () => {
    setLoading(true);
    const data = await getRandomImage(widgets.background.category);
    setImageData(data);
    triggerDownload(data.downloadLocation);
    setLoading(false);
  };

  // 새로고침 버튼 핸들러
  const handleRefresh = () => {
    loadImage();
  };

  return (
    <div className={styles.background}>
      {loading && <div className={styles.loader}>Loading...</div>}
      {imageData && (
        <>
          <img src={imageData.url} alt="Background" />
          <div className={styles.attribution}>
            Photo by <a href={imageData.authorLink}>{imageData.author}</a> on Unsplash
          </div>
          <button className={styles.refreshBtn} onClick={handleRefresh}>
            🔄
          </button>
        </>
      )}
    </div>
  );
};
```

### 3. CSS 스타일링
`Background.module.css`

#### 주요 스타일
- 전체 화면 배경 (`position: fixed, top: 0, left: 0, width: 100%, height: 100%`)
- 이미지 페이드인 애니메이션
- 저작자 표시 (하단 우측)
- 새로고침 버튼 스타일
- 로딩 인디케이터

### 4. 카테고리 옵션
설정에서 선택 가능한 카테고리:
- `nature` - 자연
- `city` - 도시
- `architecture` - 건축
- `minimal` - 미니멀
- `abstract` - 추상
- `space` - 우주
- `ocean` - 바다

### 5. useApi Hook 생성 (선택사항)
`src/hooks/useApi.js`

재사용 가능한 API 호출 로직:
```javascript
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (...params) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...params);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
};
```

### 6. App.js에 Background 추가
```javascript
import Background from './components/Background/Background';

function App() {
  return (
    <AppProvider>
      <Background />
      {/* 다른 컴포넌트들 */}
    </AppProvider>
  );
}
```

## 완료 조건
- [ ] Unsplash API가 정상적으로 작동함
- [ ] 배경 이미지가 전체 화면에 표시됨
- [ ] 새로고침 버튼이 작동함
- [ ] 저작자 표시가 나타남
- [ ] 카테고리 변경이 가능함
- [ ] 로딩 상태가 표시됨
- [ ] 에러 처리가 구현됨

## 주의사항
- Unsplash API 무료 플랜: 시간당 50 요청 제한
- 이미지 로딩 최적화 (해상도 선택)
- 저작자 표시는 Unsplash 가이드라인 준수 필수
- Download endpoint 호출 필수 (API 규정)

## 다음 단계
Phase 4: 시계/날짜 구현
