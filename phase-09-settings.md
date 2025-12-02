# Phase 9: 설정 모달

## 목표
모든 위젯과 앱 설정을 관리할 수 있는 설정 모달을 구현합니다.

## 작업 내용

### 1. Settings 컴포넌트 생성
`src/components/Settings/Settings.jsx`와 `Settings.module.css` 생성

#### 컴포넌트 구조
```javascript
const Settings = ({ isOpen, onClose }) => {
  const {
    theme,
    language,
    widgets,
    bibleTranslation,
    weatherUnit,
    updateTheme,
    updateLanguage,
    updateWidgetSettings,
    updateBibleTranslation,
    updateWeatherUnit,
    resetSettings
  } = useSettings();

  const [activeTab, setActiveTab] = useState('widgets'); // 'widgets' | 'appearance' | 'advanced'

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>설정</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.tabs}>
          <button
            className={activeTab === 'widgets' ? styles.active : ''}
            onClick={() => setActiveTab('widgets')}
          >
            위젯
          </button>
          <button
            className={activeTab === 'appearance' ? styles.active : ''}
            onClick={() => setActiveTab('appearance')}
          >
            외관
          </button>
          <button
            className={activeTab === 'advanced' ? styles.active : ''}
            onClick={() => setActiveTab('advanced')}
          >
            고급
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'widgets' && (
            <WidgetsTab widgets={widgets} updateWidgetSettings={updateWidgetSettings} />
          )}
          {activeTab === 'appearance' && (
            <AppearanceTab
              theme={theme}
              language={language}
              updateTheme={updateTheme}
              updateLanguage={updateLanguage}
            />
          )}
          {activeTab === 'advanced' && (
            <AdvancedTab
              bibleTranslation={bibleTranslation}
              weatherUnit={weatherUnit}
              updateBibleTranslation={updateBibleTranslation}
              updateWeatherUnit={updateWeatherUnit}
              resetSettings={resetSettings}
            />
          )}
        </div>
      </div>
    </div>
  );
};
```

### 2. WidgetsTab 컴포넌트
`src/components/Settings/WidgetsTab.jsx`

```javascript
const WidgetsTab = ({ widgets, updateWidgetSettings }) => {
  const toggleWidget = (widgetName) => {
    updateWidgetSettings(widgetName, {
      enabled: !widgets[widgetName].enabled
    });
  };

  return (
    <div className={styles.widgetsTab}>
      <h3>위젯 표시 설정</h3>

      <div className={styles.widgetItem}>
        <label>
          <input
            type="checkbox"
            checked={widgets.background.enabled}
            onChange={() => toggleWidget('background')}
          />
          <span>배경 이미지</span>
        </label>
        {widgets.background.enabled && (
          <select
            value={widgets.background.category}
            onChange={(e) =>
              updateWidgetSettings('background', { category: e.target.value })
            }
          >
            <option value="nature">자연</option>
            <option value="city">도시</option>
            <option value="architecture">건축</option>
            <option value="minimal">미니멀</option>
            <option value="abstract">추상</option>
            <option value="space">우주</option>
            <option value="ocean">바다</option>
          </select>
        )}
      </div>

      <div className={styles.widgetItem}>
        <label>
          <input
            type="checkbox"
            checked={widgets.clock.enabled}
            onChange={() => toggleWidget('clock')}
          />
          <span>시계</span>
        </label>
        {widgets.clock.enabled && (
          <select
            value={widgets.clock.style}
            onChange={(e) =>
              updateWidgetSettings('clock', { style: e.target.value })
            }
          >
            <option value="digital-large">디지털 (대)</option>
            <option value="analog">아날로그</option>
            <option value="digital-small">디지털 (소)</option>
          </select>
        )}
      </div>

      <div className={styles.widgetItem}>
        <label>
          <input
            type="checkbox"
            checked={widgets.weather.enabled}
            onChange={() => toggleWidget('weather')}
          />
          <span>날씨</span>
        </label>
      </div>

      <div className={styles.widgetItem}>
        <label>
          <input
            type="checkbox"
            checked={widgets.quote.enabled}
            onChange={() => toggleWidget('quote')}
          />
          <span>성경/명언</span>
        </label>
        {widgets.quote.enabled && (
          <select
            value={widgets.quote.type}
            onChange={(e) =>
              updateWidgetSettings('quote', { type: e.target.value })
            }
          >
            <option value="bible">성경만</option>
            <option value="quote">명언만</option>
            <option value="both">둘 다 (랜덤)</option>
          </select>
        )}
      </div>

      <div className={styles.widgetItem}>
        <label>
          <input
            type="checkbox"
            checked={widgets.bookmarks.enabled}
            onChange={() => toggleWidget('bookmarks')}
          />
          <span>북마크</span>
        </label>
      </div>

      <div className={styles.widgetItem}>
        <label>
          <input
            type="checkbox"
            checked={widgets.todoList.enabled}
            onChange={() => toggleWidget('todoList')}
          />
          <span>할 일 목록</span>
        </label>
      </div>
    </div>
  );
};
```

### 3. AppearanceTab 컴포넌트
`src/components/Settings/AppearanceTab.jsx`

```javascript
const AppearanceTab = ({ theme, language, updateTheme, updateLanguage }) => {
  return (
    <div className={styles.appearanceTab}>
      <h3>외관 설정</h3>

      <div className={styles.settingItem}>
        <label>테마</label>
        <div className={styles.buttonGroup}>
          <button
            className={theme === 'light' ? styles.active : ''}
            onClick={() => updateTheme('light')}
          >
            ☀️ 라이트
          </button>
          <button
            className={theme === 'dark' ? styles.active : ''}
            onClick={() => updateTheme('dark')}
          >
            🌙 다크
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <label>언어</label>
        <div className={styles.buttonGroup}>
          <button
            className={language === 'ko' ? styles.active : ''}
            onClick={() => updateLanguage('ko')}
          >
            🇰🇷 한국어
          </button>
          <button
            className={language === 'en' ? styles.active : ''}
            onClick={() => updateLanguage('en')}
          >
            🇺🇸 English
          </button>
        </div>
      </div>
    </div>
  );
};
```

### 4. AdvancedTab 컴포넌트
`src/components/Settings/AdvancedTab.jsx`

```javascript
const AdvancedTab = ({
  bibleTranslation,
  weatherUnit,
  updateBibleTranslation,
  updateWeatherUnit,
  resetSettings
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
  };

  return (
    <div className={styles.advancedTab}>
      <h3>고급 설정</h3>

      <div className={styles.settingItem}>
        <label>성경 번역본</label>
        <select
          value={bibleTranslation}
          onChange={(e) => updateBibleTranslation(e.target.value)}
        >
          <option value="korean">개역한글</option>
          <option value="kjv">King James Version</option>
          <option value="niv">New International Version</option>
          <option value="web">World English Bible</option>
        </select>
      </div>

      <div className={styles.settingItem}>
        <label>온도 단위</label>
        <div className={styles.buttonGroup}>
          <button
            className={weatherUnit === 'metric' ? styles.active : ''}
            onClick={() => updateWeatherUnit('metric')}
          >
            섭씨 (°C)
          </button>
          <button
            className={weatherUnit === 'imperial' ? styles.active : ''}
            onClick={() => updateWeatherUnit('imperial')}
          >
            화씨 (°F)
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <label>데이터 관리</label>
        <button
          className={styles.dangerBtn}
          onClick={() => setShowResetConfirm(true)}
        >
          모든 설정 초기화
        </button>
      </div>

      {showResetConfirm && (
        <div className={styles.confirmDialog}>
          <p>모든 설정과 데이터가 삭제됩니다. 계속하시겠습니까?</p>
          <div className={styles.confirmButtons}>
            <button onClick={handleReset} className={styles.dangerBtn}>
              확인
            </button>
            <button onClick={() => setShowResetConfirm(false)}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### 5. 설정 버튼 추가
App.js에 설정 버튼 추가

```javascript
const App = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppProvider>
      <Background />
      {/* 위젯들 */}

      <button
        className={styles.settingsBtn}
        onClick={() => setSettingsOpen(true)}
        aria-label="설정"
      >
        ⚙️
      </button>

      <Settings
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </AppProvider>
  );
};
```

### 6. CSS 스타일링
`Settings.module.css`

```css
.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.modalContent {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.closeBtn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.2s;
}

.closeBtn:hover {
  background: #e5e7eb;
}

.tabs {
  display: flex;
  border-bottom: 1px solid #e5e7eb;
  padding: 0 24px;
}

.tabs button {
  flex: 1;
  padding: 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tabs button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.widgetItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.widgetItem label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.widgetItem select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.settingItem {
  margin-bottom: 24px;
}

.settingItem label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}

.buttonGroup {
  display: flex;
  gap: 8px;
}

.buttonGroup button {
  flex: 1;
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.buttonGroup button.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
  font-weight: 500;
}

.dangerBtn {
  padding: 10px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.confirmDialog {
  margin-top: 16px;
  padding: 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.confirmButtons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

### 7. 키보드 단축키 (선택사항)
설정 모달을 ESC 키로 닫기

```javascript
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  };

  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [isOpen, onClose]);
```

## 완료 조건
- [ ] 설정 모달이 열리고 닫힘
- [ ] 모든 위젯 ON/OFF가 작동함
- [ ] 위젯별 세부 설정이 작동함
- [ ] 테마 전환이 작동함
- [ ] 언어 전환이 작동함
- [ ] 설정 초기화가 작동함
- [ ] 설정 변경이 즉시 반영됨
- [ ] 모달 외부 클릭 시 닫힘
- [ ] ESC 키로 닫힘

## 주의사항
- 모달이 열려있을 때 스크롤 방지
- 설정 초기화 시 확인 다이얼로그 필수
- 접근성: aria-label, 키보드 네비게이션
- 반응형 디자인 (모바일 대응)

## 개선 아이디어
- [ ] 설정 검색 기능
- [ ] 설정 프리셋
- [ ] 위젯 레이아웃 편집 UI
- [ ] 애니메이션 on/off 옵션

## 다음 단계
Phase 10: 다크모드 & 다국어 구현
