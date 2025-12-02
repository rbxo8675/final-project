# Phase 7: 북마크

## 목표
자주 방문하는 웹사이트를 빠르게 접근할 수 있는 북마크 기능을 구현합니다.

## 작업 내용

### 1. Bookmarks 컴포넌트 생성
`src/components/Bookmarks/Bookmarks.jsx`와 `Bookmarks.module.css` 생성

#### 북마크 데이터 구조
```javascript
{
  id: 'unique-id',
  title: 'Google',
  url: 'https://www.google.com',
  icon: 'https://www.google.com/favicon.ico', // 또는 react-icons 사용
  color: '#4285f4' // 선택적: 아이콘 배경 색상
}
```

#### 컴포넌트 구조
```javascript
const Bookmarks = () => {
  const { bookmarks, addBookmark, removeBookmark } = useSettings();
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className={styles.bookmarksContainer}>
      <div className={styles.bookmarksList}>
        {bookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onRemove={removeBookmark}
          />
        ))}
        <button
          className={styles.addButton}
          onClick={() => setIsAdding(true)}
        >
          +
        </button>
      </div>

      {isAdding && (
        <AddBookmarkModal
          onAdd={addBookmark}
          onClose={() => setIsAdding(false)}
        />
      )}
    </div>
  );
};
```

### 2. BookmarkItem 컴포넌트
`src/components/Bookmarks/BookmarkItem.jsx`

```javascript
const BookmarkItem = ({ bookmark, onRemove }) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <div
      className={styles.bookmarkItem}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
        <div className={styles.iconWrapper} style={{ backgroundColor: bookmark.color }}>
          {bookmark.icon ? (
            <img src={bookmark.icon} alt={bookmark.title} />
          ) : (
            <span>{bookmark.title.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className={styles.title}>{bookmark.title}</div>
      </a>

      {showDelete && (
        <button
          className={styles.deleteBtn}
          onClick={(e) => {
            e.preventDefault();
            onRemove(bookmark.id);
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};
```

### 3. AddBookmarkModal 컴포넌트
`src/components/Bookmarks/AddBookmarkModal.jsx`

```javascript
const AddBookmarkModal = ({ onAdd, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: '',
    color: '#3b82f6'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBookmark = {
      id: Date.now().toString(),
      ...formData,
      // 자동으로 favicon 가져오기
      icon: formData.icon || getFavicon(formData.url)
    };

    onAdd(newBookmark);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3>북마크 추가</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="url"
            placeholder="URL (https://example.com)"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            required
          />
          <input
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
          <div className={styles.buttons}>
            <button type="submit">추가</button>
            <button type="button" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

### 4. Favicon 자동 가져오기
`src/utils/favicon.js`

```javascript
// Google Favicon 서비스 사용
export const getFavicon = (url) => {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (error) {
    return null;
  }
};

// 또는 직접 도메인의 favicon 사용
export const getDirectFavicon = (url) => {
  try {
    const urlObj = new URL(url);
    return `${urlObj.origin}/favicon.ico`;
  } catch (error) {
    return null;
  }
};
```

### 5. CSS 스타일링
`Bookmarks.module.css`

#### 주요 스타일
```css
.bookmarksContainer {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.bookmarksList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 20px;
  max-width: 600px;
}

.bookmarkItem {
  position: relative;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;
}

.bookmarkItem:hover {
  transform: translateY(-5px);
}

.iconWrapper {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.iconWrapper img {
  width: 32px;
  height: 32px;
}

.title {
  font-size: 12px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.deleteBtn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.addButton {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  border: 2px dashed #ccc;
  background: transparent;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  transition: all 0.2s;
}

.addButton:hover {
  border-color: #666;
  color: #666;
}
```

### 6. 기본 북마크 제공
`src/data/defaultBookmarks.js`

```javascript
export const defaultBookmarks = [
  {
    id: '1',
    title: 'Google',
    url: 'https://www.google.com',
    icon: 'https://www.google.com/favicon.ico',
    color: '#4285f4'
  },
  {
    id: '2',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    icon: 'https://www.youtube.com/favicon.ico',
    color: '#ff0000'
  },
  {
    id: '3',
    title: 'GitHub',
    url: 'https://github.com',
    icon: 'https://github.com/favicon.ico',
    color: '#181717'
  },
  {
    id: '4',
    title: 'Gmail',
    url: 'https://mail.google.com',
    icon: 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    color: '#ea4335'
  }
];
```

### 7. Context에서 북마크 관리
`AppContext.js`에 북마크 관리 함수 추가

```javascript
const addBookmark = (bookmark) => {
  setState(prev => ({
    ...prev,
    bookmarks: [...prev.bookmarks, bookmark]
  }));
};

const removeBookmark = (id) => {
  setState(prev => ({
    ...prev,
    bookmarks: prev.bookmarks.filter(b => b.id !== id)
  }));
};

const updateBookmark = (id, updates) => {
  setState(prev => ({
    ...prev,
    bookmarks: prev.bookmarks.map(b =>
      b.id === id ? { ...b, ...updates } : b
    )
  }));
};
```

### 8. App.js에 Bookmarks 추가
```javascript
import Bookmarks from './components/Bookmarks/Bookmarks';

function App() {
  const { widgets } = useSettings();

  return (
    <AppProvider>
      <Background />
      {widgets.clock.enabled && <Clock />}
      {widgets.weather.enabled && <Weather />}
      {widgets.quote.enabled && <Quote />}
      {widgets.bookmarks.enabled && <Bookmarks />}
      {/* 다른 컴포넌트들 */}
    </AppProvider>
  );
}
```

## 완료 조건
- [ ] 북마크 추가가 작동함
- [ ] 북마크 삭제가 작동함
- [ ] Favicon이 자동으로 표시됨
- [ ] 북마크 클릭 시 새 탭에서 열림
- [ ] 호버 시 삭제 버튼 표시
- [ ] 최대 개수 제한 (예: 12개)
- [ ] 데이터가 localStorage에 저장됨

## 주의사항
- 북마크 개수 제한 고려 (UI/UX)
- 잘못된 URL 입력 방지 (유효성 검사)
- Favicon 로딩 실패 시 폴백 아이콘 표시
- 외부 링크: `rel="noopener noreferrer"` 필수

## 개선 아이디어
- [ ] 드래그 앤 드롭으로 순서 변경
- [ ] 북마크 편집 기능
- [ ] 폴더/카테고리 기능
- [ ] 북마크 가져오기/내보내기

## 다음 단계
Phase 8: 할 일 목록 구현
