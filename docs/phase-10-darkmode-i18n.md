# Phase 10: 다크모드 & 다국어

## 목표
다크모드 테마와 다국어(한국어/영어) 지원을 완벽하게 구현합니다.

## 작업 내용

### 1. 다크모드 구현

#### CSS 변수 설정
`src/styles/themes.css` 파일 생성

```css
:root {
  /* Light Theme */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-glass: rgba(255, 255, 255, 0.9);

  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  --border-color: #e5e7eb;
  --border-light: #f3f4f6;

  --accent-color: #3b82f6;
  --accent-hover: #2563eb;

  --success-color: #10b981;
  --danger-color: #ef4444;
  --warning-color: #f59e0b;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  /* Dark Theme */
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-glass: rgba(31, 41, 55, 0.9);

  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;

  --border-color: #374151;
  --border-light: #1f2937;

  --accent-color: #60a5fa;
  --accent-hover: #3b82f6;

  --success-color: #34d399;
  --danger-color: #f87171;
  --warning-color: #fbbf24;

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}
```

#### 테마 적용
`App.js`에서 테마 적용

```javascript
const App = () => {
  const { theme } = useSettings();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    // ...
  );
};
```

#### 모든 컴포넌트 CSS를 변수로 변경
예시: `Background.module.css`

```css
.background {
  background: var(--bg-primary);
}

.attribution {
  color: var(--text-secondary);
  background: var(--bg-glass);
  border: 1px solid var(--border-color);
}

.refreshBtn {
  background: var(--accent-color);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.refreshBtn:hover {
  background: var(--accent-hover);
}
```

#### 다크모드 전환 애니메이션
```css
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
```

### 2. 다국어(i18n) 구현

#### 번역 파일 생성
`src/locales/ko.json`

```json
{
  "app": {
    "title": "나만의 시작페이지"
  },
  "settings": {
    "title": "설정",
    "widgets": "위젯",
    "appearance": "외관",
    "advanced": "고급",
    "close": "닫기"
  },
  "widgets": {
    "background": "배경 이미지",
    "clock": "시계",
    "weather": "날씨",
    "quote": "성경/명언",
    "bookmarks": "북마크",
    "todoList": "할 일 목록"
  },
  "clock": {
    "styles": {
      "digital-large": "디지털 (대)",
      "analog": "아날로그",
      "digital-small": "디지털 (소)"
    }
  },
  "weather": {
    "loading": "날씨 불러오는 중...",
    "feelsLike": "체감",
    "humidity": "습도",
    "windSpeed": "풍속",
    "refresh": "새로고침"
  },
  "quote": {
    "newVerse": "새 구절",
    "newQuote": "새 명언",
    "types": {
      "bible": "성경만",
      "quote": "명언만",
      "both": "둘 다 (랜덤)"
    }
  },
  "bookmarks": {
    "add": "북마크 추가",
    "title": "제목",
    "url": "URL",
    "cancel": "취소",
    "save": "저장"
  },
  "todos": {
    "title": "할 일",
    "remaining": "개 남음",
    "placeholder": "새로운 할 일을 입력하세요...",
    "add": "추가",
    "all": "전체",
    "active": "진행중",
    "completed": "완료",
    "empty": "할 일이 없습니다",
    "clearCompleted": "완료된 항목 삭제"
  },
  "theme": {
    "light": "라이트",
    "dark": "다크"
  },
  "language": {
    "korean": "한국어",
    "english": "English"
  }
}
```

`src/locales/en.json`

```json
{
  "app": {
    "title": "My Start Page"
  },
  "settings": {
    "title": "Settings",
    "widgets": "Widgets",
    "appearance": "Appearance",
    "advanced": "Advanced",
    "close": "Close"
  },
  "widgets": {
    "background": "Background Image",
    "clock": "Clock",
    "weather": "Weather",
    "quote": "Bible/Quote",
    "bookmarks": "Bookmarks",
    "todoList": "Todo List"
  },
  "clock": {
    "styles": {
      "digital-large": "Digital (Large)",
      "analog": "Analog",
      "digital-small": "Digital (Small)"
    }
  },
  "weather": {
    "loading": "Loading weather...",
    "feelsLike": "Feels like",
    "humidity": "Humidity",
    "windSpeed": "Wind speed",
    "refresh": "Refresh"
  },
  "quote": {
    "newVerse": "New Verse",
    "newQuote": "New Quote",
    "types": {
      "bible": "Bible Only",
      "quote": "Quote Only",
      "both": "Both (Random)"
    }
  },
  "bookmarks": {
    "add": "Add Bookmark",
    "title": "Title",
    "url": "URL",
    "cancel": "Cancel",
    "save": "Save"
  },
  "todos": {
    "title": "Todos",
    "remaining": "remaining",
    "placeholder": "Add a new todo...",
    "add": "Add",
    "all": "All",
    "active": "Active",
    "completed": "Completed",
    "empty": "No todos",
    "clearCompleted": "Clear Completed"
  },
  "theme": {
    "light": "Light",
    "dark": "Dark"
  },
  "language": {
    "korean": "한국어",
    "english": "English"
  }
}
```

#### i18n Hook 생성
`src/hooks/useTranslation.js`

```javascript
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import koTranslations from '../locales/ko.json';
import enTranslations from '../locales/en.json';

const translations = {
  ko: koTranslations,
  en: enTranslations
};

export const useTranslation = () => {
  const { language } = useContext(AppContext);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // 번역을 찾지 못하면 키를 반환
      }
    }

    return value || key;
  };

  return { t, language };
};
```

#### 컴포넌트에서 사용
```javascript
import { useTranslation } from '../../hooks/useTranslation';

const TodoList = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{t('todos.title')}</h3>
      <input placeholder={t('todos.placeholder')} />
      <button>{t('todos.add')}</button>
    </div>
  );
};
```

### 3. 폰트 설정
`public/index.html`에 다국어 폰트 추가

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
```

`src/index.css`

```css
body {
  font-family: 'Inter', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### 4. 다크모드 이미지 처리
배경 이미지에 다크 오버레이 적용

```css
[data-theme="dark"] .background::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}
```

### 5. 시스템 테마 감지 (선택사항)
```javascript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handleChange = (e) => {
    if (!localStorage.getItem('user-theme-preference')) {
      updateTheme(e.matches ? 'dark' : 'light');
    }
  };

  mediaQuery.addEventListener('change', handleChange);

  // 초기 설정
  if (!localStorage.getItem('user-theme-preference')) {
    updateTheme(mediaQuery.matches ? 'dark' : 'light');
  }

  return () => mediaQuery.removeEventListener('change', handleChange);
}, []);
```

### 6. 모든 컴포넌트 업데이트
각 컴포넌트에서:
1. CSS를 CSS 변수로 변경
2. 하드코딩된 텍스트를 `t()` 함수로 변경
3. 다크모드에서 가독성 확인

### 7. 테스트 체크리스트
- [ ] 라이트/다크 모드 전환이 부드러움
- [ ] 모든 텍스트가 번역됨
- [ ] 모든 색상이 적절하게 표시됨
- [ ] 그림자가 자연스러움
- [ ] 폰트가 정상 표시됨
- [ ] 아이콘/이미지가 테마에 맞게 조정됨

## 완료 조건
- [ ] 다크모드가 모든 컴포넌트에 적용됨
- [ ] 테마 전환 애니메이션이 부드러움
- [ ] 한국어/영어 완전 번역
- [ ] 번역 누락 없음
- [ ] 설정이 localStorage에 저장됨
- [ ] 페이지 새로고침 시 테마 유지

## 주의사항
- 모든 색상은 CSS 변수 사용
- 번역 키 네이밍 규칙 일관성
- 폰트 로딩 최적화
- 접근성: 충분한 대비율 (WCAG AA 기준)

## 개선 아이디어
- [ ] 시스템 테마 자동 감지
- [ ] 테마 커스터마이징 (색상 선택)
- [ ] 더 많은 언어 추가
- [ ] 번역 기여 시스템

## 다음 단계
Phase 11: theme code 기능 구현
