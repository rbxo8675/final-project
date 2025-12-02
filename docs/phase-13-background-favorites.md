# Phase 13: 배경 이미지 즐겨찾기

## 목표
랜덤으로 생성된 Unsplash 이미지나 사용자가 업로드한 이미지를 즐겨찾기로 저장하고, 저장된 이미지를 배경으로 선택할 수 있는 기능을 구현합니다.

## 작업 내용

### 1. 데이터 구조 설계

#### 즐겨찾기 이미지 스키마
```javascript
{
  id: string,           // 고유 ID (uuid 또는 timestamp)
  type: 'unsplash' | 'upload',  // 이미지 소스 타입
  url: string,          // 이미지 URL (Unsplash) 또는 Base64/Blob URL (업로드)
  thumbnail: string,    // 썸네일 URL (미리보기용)
  author: string,       // 저작자명 (Unsplash인 경우)
  authorLink: string,   // 저작자 링크 (Unsplash인 경우)
  addedAt: timestamp,   // 추가된 시간
  name: string          // 사용자 지정 이름 (선택)
}
```

#### Context 상태 확장
```javascript
// AppContext에 추가
{
  backgroundFavorites: [],        // 즐겨찾기 이미지 목록
  currentBackground: null,        // 현재 선택된 배경 (null이면 랜덤)
  backgroundMode: 'random' | 'favorite'  // 배경 모드
}
```

### 2. localStorage 유틸리티 확장
`src/utils/storage.js`에 추가

```javascript
// 즐겨찾기 이미지 저장/불러오기
export const getFavoriteBackgrounds = () => {
  return JSON.parse(localStorage.getItem('backgroundFavorites')) || [];
};

export const saveFavoriteBackgrounds = (favorites) => {
  localStorage.setItem('backgroundFavorites', JSON.stringify(favorites));
};

// 이미지 용량 제한 (Base64 저장 시)
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB 제한
```

### 3. Background 컴포넌트 확장

#### 즐겨찾기 추가 버튼
```javascript
// 현재 이미지를 즐겨찾기에 추가
const handleAddToFavorites = () => {
  const newFavorite = {
    id: Date.now().toString(),
    type: 'unsplash',
    url: imageData.url,
    thumbnail: imageData.urls.small, // 썸네일용 작은 이미지
    author: imageData.author,
    authorLink: imageData.authorLink,
    addedAt: Date.now()
  };
  addFavorite(newFavorite);
};

// UI에 하트 버튼 추가
<button
  className={styles.favoriteBtn}
  onClick={handleAddToFavorites}
  title="즐겨찾기에 추가"
>
  {isFavorited ? '❤️' : '🤍'}
</button>
```

### 4. 이미지 업로드 기능

#### 파일 업로드 핸들러
```javascript
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 파일 크기 검증 (5MB 제한)
  if (file.size > 5 * 1024 * 1024) {
    alert('이미지 크기는 5MB 이하여야 합니다.');
    return;
  }

  // 파일 타입 검증
  if (!file.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const newFavorite = {
      id: Date.now().toString(),
      type: 'upload',
      url: e.target.result,  // Base64 데이터
      thumbnail: e.target.result,
      author: '',
      authorLink: '',
      addedAt: Date.now(),
      name: file.name
    };
    addFavorite(newFavorite);
  };
  reader.readAsDataURL(file);
};
```

#### 업로드 버튼 UI
```javascript
<label className={styles.uploadBtn}>
  📁 이미지 업로드
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    style={{ display: 'none' }}
  />
</label>
```

### 5. 즐겨찾기 갤러리 컴포넌트
`src/components/Background/FavoritesGallery.jsx`

```javascript
const FavoritesGallery = ({ isOpen, onClose }) => {
  const { backgroundFavorites, removeFavorite, setCurrentBackground } = useSettings();

  const handleSelect = (favorite) => {
    setCurrentBackground(favorite);
    onClose();
  };

  const handleRemove = (id) => {
    if (confirm('즐겨찾기에서 삭제하시겠습니까?')) {
      removeFavorite(id);
    }
  };

  return (
    <div className={styles.gallery}>
      <h3>즐겨찾기 배경</h3>
      <div className={styles.grid}>
        {backgroundFavorites.map(fav => (
          <div key={fav.id} className={styles.item}>
            <img
              src={fav.thumbnail}
              alt={fav.name || '배경 이미지'}
              onClick={() => handleSelect(fav)}
            />
            <button
              className={styles.removeBtn}
              onClick={() => handleRemove(fav.id)}
            >
              ✕
            </button>
            {fav.type === 'unsplash' && (
              <span className={styles.author}>📷 {fav.author}</span>
            )}
          </div>
        ))}
      </div>
      <button onClick={() => setCurrentBackground(null)}>
        🔀 랜덤 모드로 전환
      </button>
    </div>
  );
};
```

### 6. CSS 스타일링
`Background.module.css`에 추가

```css
/* 즐겨찾기 버튼 */
.favoriteBtn {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  transition: transform 0.2s;
}

.favoriteBtn:hover {
  transform: scale(1.1);
}

/* 갤러리 그리드 */
.gallery {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-color);
  padding: 20px;
  border-radius: 12px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.item {
  position: relative;
  aspect-ratio: 16/9;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
}

.item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s;
}

.item:hover img {
  transform: scale(1.05);
}

.removeBtn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
}
```

### 7. Context Actions 추가
`src/contexts/AppContext.js`에 추가

```javascript
const addFavorite = (favorite) => {
  setSettings(prev => ({
    ...prev,
    backgroundFavorites: [...prev.backgroundFavorites, favorite]
  }));
};

const removeFavorite = (id) => {
  setSettings(prev => ({
    ...prev,
    backgroundFavorites: prev.backgroundFavorites.filter(f => f.id !== id)
  }));
};

const setCurrentBackground = (background) => {
  setSettings(prev => ({
    ...prev,
    currentBackground: background,
    backgroundMode: background ? 'favorite' : 'random'
  }));
};
```

### 8. 설정 모달 연동
Settings 컴포넌트에서 즐겨찾기 관리 UI 추가:
- 즐겨찾기 목록 보기/관리
- 이미지 업로드
- 배경 모드 전환 (랜덤/즐겨찾기)

## 완료 조건
- [ ] 현재 배경 이미지를 즐겨찾기에 추가 가능
- [ ] 즐겨찾기에서 이미지 제거 가능
- [ ] 로컬 이미지 업로드 기능 작동
- [ ] 업로드 이미지 크기 제한 (5MB) 적용
- [ ] 즐겨찾기 갤러리에서 배경 선택 가능
- [ ] 랜덤 모드와 즐겨찾기 모드 전환 가능
- [ ] 즐겨찾기 데이터 localStorage에 저장됨
- [ ] Unsplash 이미지의 저작자 정보 유지
- [ ] 반응형 갤러리 UI

## 주의사항
- Base64로 저장된 이미지는 localStorage 용량을 많이 차지함 (5MB 브라우저 제한 고려)
- 대용량 이미지는 썸네일 생성 후 원본 URL만 저장 권장
- Unsplash 이미지는 URL 저장으로 용량 절약 가능
- 업로드 이미지가 많을 경우 IndexedDB 전환 고려

## 향후 개선 사항
- IndexedDB를 사용한 대용량 이미지 저장
- 이미지 압축/리사이징 기능
- 클라우드 동기화 (선택적)
- 즐겨찾기 폴더/태그 기능
- 슬라이드쇼 모드 (즐겨찾기 이미지 순환)

## 다음 단계
완료 후 Phase 11 (Theme Code)에 즐겨찾기 데이터 포함 여부 결정
