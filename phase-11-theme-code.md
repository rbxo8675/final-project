# Phase 11: Theme Code 기능

## 목표
사용자의 설정을 코드로 내보내고 가져올 수 있는 Theme Code 기능을 구현합니다.

## 작업 내용

### 1. Theme Code 유틸리티 강화
`src/utils/storage.js` 업데이트

```javascript
// Theme Code 생성 (Base64 인코딩)
export const generateThemeCode = (settings) => {
  try {
    const jsonString = JSON.stringify(settings);
    const base64 = btoa(encodeURIComponent(jsonString));
    return base64;
  } catch (error) {
    console.error('Failed to generate theme code:', error);
    return null;
  }
};

// Theme Code 파싱
export const parseThemeCode = (code) => {
  try {
    const jsonString = decodeURIComponent(atob(code));
    const settings = JSON.parse(jsonString);
    return validateSettings(settings);
  } catch (error) {
    console.error('Failed to parse theme code:', error);
    return null;
  }
};

// 설정 유효성 검사
const validateSettings = (settings) => {
  // 필수 필드 확인
  const requiredFields = ['theme', 'language', 'widgets'];

  for (const field of requiredFields) {
    if (!(field in settings)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // 위젯 설정 검증
  const validWidgets = ['background', 'clock', 'weather', 'quote', 'bookmarks', 'todoList'];
  for (const widget of validWidgets) {
    if (!settings.widgets[widget]) {
      throw new Error(`Missing widget configuration: ${widget}`);
    }
  }

  return settings;
};

// 설정을 압축된 코드로 (선택사항)
export const compressSettings = (settings) => {
  // LZ-String 또는 pako 라이브러리 사용 가능
  // 여기서는 간단하게 Base64만 사용
  return generateThemeCode(settings);
};
```

### 2. ThemeCode 컴포넌트 생성
`src/components/Settings/ThemeCode.jsx`

```javascript
import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { generateThemeCode, parseThemeCode } from '../../utils/storage';
import { useTranslation } from '../../hooks/useTranslation';
import styles from './ThemeCode.module.css';

const ThemeCode = () => {
  const { t } = useTranslation();
  const { settings, importSettings } = useSettings();
  const [code, setCode] = useState('');
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importError, setImportError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // 내보내기
  const handleExport = () => {
    const themeCode = generateThemeCode(settings);
    if (themeCode) {
      setCode(themeCode);
      setShowExport(true);
    }
  };

  // 클립보드 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // 가져오기
  const handleImport = () => {
    setImportError('');

    if (!code.trim()) {
      setImportError(t('themeCode.emptyCode'));
      return;
    }

    const parsedSettings = parseThemeCode(code.trim());

    if (!parsedSettings) {
      setImportError(t('themeCode.invalidCode'));
      return;
    }

    // 확인 다이얼로그
    if (window.confirm(t('themeCode.importConfirm'))) {
      importSettings(parsedSettings);
      setShowImport(false);
      setCode('');
    }
  };

  // 파일로 다운로드 (선택사항)
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startpage-theme-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 파일 업로드 (선택사항)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles.themeCode}>
      <h3>{t('themeCode.title')}</h3>
      <p className={styles.description}>{t('themeCode.description')}</p>

      <div className={styles.buttons}>
        <button onClick={handleExport} className={styles.exportBtn}>
          📤 {t('themeCode.export')}
        </button>
        <button onClick={() => setShowImport(!showImport)} className={styles.importBtn}>
          📥 {t('themeCode.import')}
        </button>
      </div>

      {/* 내보내기 모달 */}
      {showExport && (
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h4>{t('themeCode.exportTitle')}</h4>
            <button onClick={() => setShowExport(false)}>×</button>
          </div>
          <textarea
            value={code}
            readOnly
            className={styles.codeTextarea}
            rows={6}
          />
          <div className={styles.modalActions}>
            <button onClick={handleCopy} className={styles.copyBtn}>
              {copySuccess ? '✓ ' + t('themeCode.copied') : t('themeCode.copy')}
            </button>
            <button onClick={handleDownload} className={styles.downloadBtn}>
              {t('themeCode.download')}
            </button>
          </div>
        </div>
      )}

      {/* 가져오기 섹션 */}
      {showImport && (
        <div className={styles.importSection}>
          <h4>{t('themeCode.importTitle')}</h4>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('themeCode.pasteCode')}
            className={styles.codeTextarea}
            rows={6}
          />
          {importError && (
            <div className={styles.error}>{importError}</div>
          )}
          <div className={styles.importActions}>
            <input
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className={styles.fileInput}
              id="themeCodeFile"
            />
            <label htmlFor="themeCodeFile" className={styles.uploadBtn}>
              {t('themeCode.uploadFile')}
            </label>
            <button onClick={handleImport} className={styles.importConfirmBtn}>
              {t('themeCode.importConfirm')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeCode;
```

### 3. CSS 스타일링
`src/components/Settings/ThemeCode.module.css`

```css
.themeCode {
  padding: 16px;
}

.description {
  color: var(--text-secondary);
  font-size: 14px;
  margin-bottom: 16px;
}

.buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.exportBtn,
.importBtn {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--accent-color);
  background: var(--bg-primary);
  color: var(--accent-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.exportBtn:hover,
.importBtn:hover {
  background: var(--accent-color);
  color: white;
}

.modal {
  margin-top: 16px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.modalHeader h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.modalHeader button {
  width: 28px;
  height: 28px;
  border: none;
  background: var(--border-light);
  border-radius: 6px;
  cursor: pointer;
  font-size: 20px;
}

.codeTextarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Courier New', monospace;
  font-size: 12px;
  resize: vertical;
  margin-bottom: 12px;
}

.modalActions,
.importActions {
  display: flex;
  gap: 8px;
}

.copyBtn,
.downloadBtn,
.uploadBtn,
.importConfirmBtn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.copyBtn {
  background: var(--accent-color);
  color: white;
}

.downloadBtn {
  background: var(--success-color);
  color: white;
}

.uploadBtn {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.importConfirmBtn {
  background: var(--accent-color);
  color: white;
  flex: 1;
}

.fileInput {
  display: none;
}

.importSection {
  margin-top: 16px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.importSection h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.error {
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--danger-color);
  border-radius: 6px;
  color: var(--danger-color);
  font-size: 14px;
  margin-bottom: 12px;
}
```

### 4. Context에 import 함수 추가
`AppContext.js`

```javascript
const importSettings = (newSettings) => {
  // 기존 북마크와 할 일은 유지하거나 선택 가능하게
  const shouldMergeData = window.confirm(
    '북마크와 할 일 목록도 가져오시겠습니까?'
  );

  setState(prev => ({
    ...newSettings,
    bookmarks: shouldMergeData ? newSettings.bookmarks : prev.bookmarks,
    todos: shouldMergeData ? newSettings.todos : prev.todos
  }));
};
```

### 5. 설정 모달에 ThemeCode 추가
`Settings.jsx`의 Advanced 탭에 추가

```javascript
<AdvancedTab>
  {/* 기존 설정들 */}
  <ThemeCode />
</AdvancedTab>
```

### 6. 번역 추가
`ko.json`과 `en.json`에 추가

```json
{
  "themeCode": {
    "title": "테마 코드",
    "description": "설정을 코드로 내보내거나 가져올 수 있습니다.",
    "export": "내보내기",
    "import": "가져오기",
    "exportTitle": "테마 코드 내보내기",
    "importTitle": "테마 코드 가져오기",
    "copy": "복사",
    "copied": "복사됨",
    "download": "파일로 저장",
    "uploadFile": "파일 선택",
    "pasteCode": "테마 코드를 여기에 붙여넣으세요...",
    "emptyCode": "코드를 입력해주세요.",
    "invalidCode": "유효하지 않은 코드입니다.",
    "importConfirm": "현재 설정을 덮어쓰시겠습니까?"
  }
}
```

### 7. URL 공유 기능 (선택사항)
URL 파라미터로 테마 코드 공유

```javascript
// URL에서 테마 코드 읽기
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const themeCode = params.get('theme');

  if (themeCode) {
    const settings = parseThemeCode(themeCode);
    if (settings && window.confirm('테마를 적용하시겠습니까?')) {
      importSettings(settings);
      // URL에서 파라미터 제거
      window.history.replaceState({}, '', window.location.pathname);
    }
  }
}, []);

// 공유 URL 생성
const getShareUrl = () => {
  const themeCode = generateThemeCode(settings);
  return `${window.location.origin}?theme=${themeCode}`;
};
```

### 8. QR 코드 생성 (선택사항)
다른 기기에서 쉽게 가져올 수 있도록

```bash
npm install qrcode.react
```

```javascript
import QRCode from 'qrcode.react';

<QRCode value={code} size={200} />
```

## 완료 조건
- [ ] 테마 코드 생성이 작동함
- [ ] 테마 코드 가져오기가 작동함
- [ ] 클립보드 복사가 작동함
- [ ] 파일 다운로드가 작동함
- [ ] 파일 업로드가 작동함
- [ ] 잘못된 코드 에러 처리
- [ ] 가져오기 시 확인 다이얼로그
- [ ] 번역이 모두 적용됨

## 주의사항
- 코드 유효성 검사 필수
- 민감한 정보 포함 여부 확인
- 버전 호환성 (향후 업데이트 시)
- 코드 크기 제한 (URL의 경우)

## 개선 아이디어
- [ ] QR 코드로 공유
- [ ] URL로 테마 공유
- [ ] 커뮤니티 테마 갤러리
- [ ] 테마 프리셋 제공
- [ ] 압축 알고리즘으로 코드 크기 축소

## 다음 단계
Phase 12: Vercel 배포
