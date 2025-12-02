# Phase 2: Context 및 localStorage

## 목표
전역 상태 관리를 위한 React Context를 구현하고 localStorage를 연동합니다.

## 작업 내용

### 1. AppContext 생성
`src/contexts/AppContext.js` 파일 생성

#### 관리할 상태
```javascript
{
  // 테마 설정
  theme: 'light' | 'dark',
  language: 'ko' | 'en',

  // 위젯 설정
  widgets: {
    background: { enabled: true, category: 'nature' },
    clock: { enabled: true, style: 'digital-large' },
    weather: { enabled: true },
    quote: { enabled: true, type: 'bible' }, // 'bible' | 'quote' | 'both'
    bookmarks: { enabled: true },
    todoList: { enabled: true }
  },

  // 위젯 레이아웃
  layout: [],

  // 데이터
  bookmarks: [],
  todos: [],

  // API 설정
  bibleTranslation: 'korean',
  weatherUnit: 'metric'
}
```

### 2. Context Provider 구현
- Context 생성
- Provider 컴포넌트 구현
- 상태 업데이트 함수들 구현:
  - `updateTheme(theme)`
  - `updateLanguage(language)`
  - `updateWidgetSettings(widgetName, settings)`
  - `updateLayout(layout)`
  - `addBookmark(bookmark)`
  - `removeBookmark(id)`
  - `addTodo(todo)`
  - `toggleTodo(id)`
  - `removeTodo(id)`

### 3. localStorage 유틸리티 생성
`src/utils/storage.js` 파일 생성

#### 구현할 함수
```javascript
// 설정 저장
export const saveSettings = (settings) => {
  localStorage.setItem('startpage-settings', JSON.stringify(settings));
};

// 설정 불러오기
export const loadSettings = () => {
  const saved = localStorage.getItem('startpage-settings');
  return saved ? JSON.parse(saved) : null;
};

// 설정 초기화
export const resetSettings = () => {
  localStorage.removeItem('startpage-settings');
};

// Theme Code 생성
export const generateThemeCode = (settings) => {
  return btoa(JSON.stringify(settings));
};

// Theme Code 파싱
export const parseThemeCode = (code) => {
  try {
    return JSON.parse(atob(code));
  } catch (e) {
    return null;
  }
};
```

### 4. Context와 localStorage 연동
- 초기 로드 시 localStorage에서 설정 불러오기
- 상태 변경 시 자동으로 localStorage에 저장
- useEffect를 활용한 동기화

### 5. App.js에 Provider 적용
```javascript
import { AppProvider } from './contexts/AppContext';

function App() {
  return (
    <AppProvider>
      {/* 앱 컴포넌트들 */}
    </AppProvider>
  );
}
```

### 6. Custom Hook 생성 (선택사항)
`src/hooks/useSettings.js`
```javascript
export const useSettings = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useSettings must be used within AppProvider');
  }
  return context;
};
```

## 완료 조건
- [ ] AppContext가 생성되고 모든 필요한 상태를 관리함
- [ ] localStorage 유틸리티가 정상 작동함
- [ ] Context 값이 localStorage와 동기화됨
- [ ] 페이지 새로고침 시 설정이 유지됨

## 테스트 방법
1. 브라우저 개발자 도구에서 Application > Local Storage 확인
2. Context 값 변경 시 localStorage가 업데이트되는지 확인
3. 페이지 새로고침 후 설정이 복원되는지 확인

## 다음 단계
Phase 3: 배경 이미지 구현
