# PRD: 나만의 시작페이지 (My Start Page)

## 1. 제품 개요

### 1.1 제품 비전
매일 새로운 영감과 생산성을 제공하는 개인화된 브라우저 시작페이지. 아름다운 배경 이미지 위에 시계, 날씨, 명언/성경구절, 북마크, 작업 관리 위젯을 배치하여 사용자만의 맞춤형 대시보드를 구성할 수 있습니다.

### 1.2 목표 사용자
- 브라우저를 열 때마다 영감을 받고 싶은 사용자
- 생산성 도구와 아름다운 UI를 함께 원하는 사용자
- 북마크, 할 일 목록 등을 한 곳에서 관리하고 싶은 사용자
- 성경 구절이나 명언으로 하루를 시작하고 싶은 사용자

### 1.3 핵심 가치
- **개인화**: 위젯 선택, 배치, 스타일을 자유롭게 커스터마이징
- **심미성**: 고해상도 배경 이미지와 세련된 위젯 디자인
- **생산성**: 할 일 관리, 북마크, 시계, 날씨를 한눈에
- **다국어**: 한국어/영어 완벽 지원

---

## 2. 기술 스택

| 항목 | 선택 | 비고 |
|------|------|------|
| 프레임워크 | Create React App | React 19 |
| 상태관리 | React Context + useReducer | 중앙집중식 상태 관리 |
| 스타일링 | CSS Modules | 컴포넌트 단위 스코프 스타일 |
| 레이아웃 | react-grid-layout | 드래그 앤 드롭 그리드 시스템 |
| 아이콘 | react-icons (Ionicons) | 일관된 아이콘 디자인 |
| 데이터 저장 | localStorage + IndexedDB | 설정은 localStorage, 이미지는 IndexedDB |
| 배포 | Vercel | 정적 사이트 호스팅 |

---

## 3. 핵심 기능

### 3.1 배경 이미지 시스템

#### 3.1.1 이미지 소스
- **Pexels API** (주요): 고해상도 원본 이미지 제공
- **Pixabay API** (폴백): Pexels 실패 시 자동 전환

#### 3.1.2 카테고리
| ID | 한국어 | English |
|----|--------|---------|
| nature | 자연 | Nature |
| city | 도시 | City |
| architecture | 건축 | Architecture |
| ocean | 바다 | Ocean |
| mountain | 산 | Mountain |
| forest | 숲 | Forest |
| travel | 여행 | Travel |
| space | 우주 | Space |
| animals | 동물 | Animals |
| abstract | 추상 | Abstract |

#### 3.1.3 배경 모드
- **랜덤 모드**: 새로고침마다 선택된 카테고리에서 랜덤 이미지
- **즐겨찾기 모드**: 저장된 이미지 중 선택하여 고정

#### 3.1.4 즐겨찾기 기능
- 현재 배경 이미지 하트 버튼으로 저장/해제 (토글)
- 로컬 이미지 업로드 지원 (최대 10MB)
- 즐겨찾기 갤러리에서 이미지 선택/삭제
- 즐겨찾기 이미지 위치 조정 (가로/세로 슬라이더)

---

### 3.2 위젯 시스템

#### 3.2.1 위젯 그리드
- **12컬럼 그리드** 레이아웃 (react-grid-layout)
- **정사각형 셀**: 화면 너비에 따라 자동 계산
- **편집 모드**: 위젯 추가/이동/크기조정/삭제
- **자동 저장**: 레이아웃 변경 시 localStorage에 저장

#### 3.2.2 위젯 스타일
| ID | 한국어 | English | 설명 |
|----|--------|---------|------|
| glass | 글래스 | Glass | 반투명 글래스모피즘 |
| solid | 솔리드 | Solid | 불투명 흰색 배경 |
| minimal | 미니멀 | Minimal | 투명 배경 |
| neon | 네온 | Neon | 네온 글로우 효과 |
| frosted | 프로스트 | Frosted | 서리 효과 |

#### 3.2.3 사용 가능한 위젯

##### 시계 (Clock)
| 스타일 | 설명 |
|--------|------|
| digital-large | 큰 디지털 시계 (날짜 포함) |
| digital-small | 작은 디지털 시계 |
| analog | 아날로그 시계 |

##### 날씨 (Weather)
- OpenWeatherMap API 연동
- Geolocation으로 현재 위치 감지
- 날씨 아이콘, 온도, 습도, 체감온도 표시
- 온도 단위 선택 (섭씨/화씨)

##### 명언/성경 구절 (Quote)
| 타입 | 설명 |
|------|------|
| bible | 한글 성경 구절 (로컬 JSON 데이터) |
| quote | 영감을 주는 명언 (한글 데이터) |

##### 북마크 (Bookmarks)
| 사이즈 | 설명 |
|--------|------|
| large | 큰 아이콘 + 텍스트 |
| medium | 중간 크기 아이콘 + 텍스트 |
| small | 작은 아이콘만 |

- 북마크 추가/편집/삭제
- Google Favicon API로 파비콘 표시
- 드래그 앤 드롭 정렬

##### 할 일 목록 (TodoList)
- 할 일 추가/완료/삭제
- 완료 시 취소선 스타일
- 더블클릭으로 편집
- 위젯별 독립 데이터 저장

##### 스티키 노트 (StickyNote)
- 자유 메모 입력
- 6가지 색상: 노랑, 분홍, 파랑, 초록, 보라, 주황
- 편집 모드에서 색상 변경

##### 칸반 보드 (Kanban)
- 2개 컬럼: 할 일, 진행 중
- 카드 드래그 앤 드롭으로 컬럼 이동
- 완료 드롭존에 드래그하면 삭제 + 완료 애니메이션
- 카드 추가/삭제

---

### 3.3 설정 시스템

#### 3.3.1 사이드바 레이아웃
3개 탭으로 구성된 설정 패널:

##### 외관 (Appearance)
- 페이지 제목 설정
- 페이지 아이콘 (이모지) 선택
- 테마 (라이트/다크)
- 언어 (한국어/영어)
- 위젯 스타일 선택

##### 배경 (Background)
- 배경 모드 (랜덤/즐겨찾기)
- 카테고리 선택 (랜덤 모드)
- 이미지 업로드
- 저장된 이미지 갤러리
- 이미지 위치 조정 (즐겨찾기 모드)
- 배경 사용 ON/OFF

##### 인터페이스 (Interface)
- 위젯 레이아웃 편집 모드 진입
- 컨트롤 자동 숨김 ON/OFF
- 숨김 지연 시간 설정 (1초~5초)

#### 3.3.2 편집 모드
- 화면 상단에 안내 메시지 표시
- + 버튼으로 위젯 갤러리 열기
- 위젯 드래그하여 위치 이동
- 위젯 가장자리 드래그하여 크기 조정
- X 버튼으로 위젯 삭제
- 완료 버튼으로 편집 모드 종료

---

### 3.4 데이터 저장

#### 3.4.1 localStorage
모든 설정 및 데이터를 `startpage-settings` 키에 JSON으로 저장:
- 테마, 언어, 위젯 스타일
- UI 설정 (편집 모드, 컨트롤 설정)
- 위젯 인스턴스 및 레이아웃
- 북마크, 할 일 목록
- 위젯별 데이터 (widgetData)
- 배경 즐겨찾기 및 설정
- 페이지 제목 및 아이콘

#### 3.4.2 IndexedDB
- 업로드된 이미지 데이터 저장
- Base64 인코딩된 이미지 파일

#### 3.4.3 Theme Code (예정)
- 설정을 Base64 인코딩하여 내보내기
- 다른 기기에서 Theme Code로 설정 가져오기

---

### 3.5 다국어 지원

#### 3.5.1 지원 언어
- 한국어 (ko) - 기본값
- English (en)

#### 3.5.2 번역 범위
- 모든 UI 텍스트
- 위젯 레이블
- 설정 옵션
- 에러 메시지
- 날짜/시간 포맷

---

### 3.6 테마 시스템

#### 3.6.1 라이트 모드
- 밝은 배경색
- 어두운 텍스트
- 밝은 위젯 스타일

#### 3.6.2 다크 모드
- 어두운 배경색
- 밝은 텍스트
- 어두운 위젯 스타일
- CSS 변수 기반 자동 전환

---

## 4. 프로젝트 구조

```
src/
├── components/           # UI 컴포넌트
│   ├── Background/       # 배경 이미지
│   │   ├── Background.jsx
│   │   ├── Background.module.css
│   │   ├── FavoritesGallery.jsx
│   │   └── FavoritesGallery.module.css
│   ├── Clock/            # 시계 위젯
│   │   ├── Clock.jsx
│   │   ├── DigitalLarge.jsx
│   │   ├── DigitalSmall.jsx
│   │   ├── Analog.jsx
│   │   └── Clock.module.css
│   ├── Weather/          # 날씨 위젯
│   │   ├── Weather.jsx
│   │   └── Weather.module.css
│   ├── Quote/            # 명언/성경 위젯
│   │   ├── Quote.jsx
│   │   └── Quote.module.css
│   ├── Bookmarks/        # 북마크 위젯
│   │   ├── Bookmarks.jsx
│   │   └── Bookmarks.module.css
│   ├── TodoList/         # 할 일 목록 위젯
│   │   ├── TodoList.jsx
│   │   └── TodoList.module.css
│   ├── StickyNote/       # 스티키 노트 위젯
│   │   ├── StickyNote.jsx
│   │   └── StickyNote.module.css
│   ├── Kanban/           # 칸반 보드 위젯
│   │   ├── Kanban.jsx
│   │   └── Kanban.module.css
│   ├── WidgetGrid/       # 위젯 그리드 시스템
│   │   ├── WidgetGrid.jsx
│   │   └── WidgetGrid.module.css
│   └── Settings/         # 설정 패널
│       ├── Settings.jsx
│       └── Settings.module.css
├── contexts/             # React Context
│   └── AppContext.js     # 전역 상태 관리
├── hooks/                # 커스텀 훅
│   ├── useSettings.js    # 설정 접근 훅
│   └── useApi.js         # API 호출 훅
├── services/             # API 서비스
│   ├── imageApi.js       # Pexels/Pixabay API
│   ├── weather.js        # OpenWeatherMap API
│   └── quote.js          # 명언/성경 구절
├── utils/                # 유틸리티
│   ├── storage.js        # localStorage 관리
│   └── indexedDB.js      # IndexedDB 관리
├── App.js                # 메인 앱 컴포넌트
├── App.css               # 전역 스타일
└── index.js              # 앱 진입점
```

---

## 5. API 연동

### 5.1 이미지 API

#### Pexels API
- 엔드포인트: `https://api.pexels.com/v1/search`
- 인증: `Authorization` 헤더
- 환경변수: `REACT_APP_PEXELS_API_KEY`

#### Pixabay API
- 엔드포인트: `https://pixabay.com/api/`
- 인증: Query parameter (`key`)
- 환경변수: `REACT_APP_PIXABAY_API_KEY`

### 5.2 날씨 API

#### OpenWeatherMap API
- 엔드포인트: `https://api.openweathermap.org/data/2.5/weather`
- 인증: Query parameter (`appid`)
- 환경변수: `REACT_APP_OPENWEATHER_API_KEY`

---

## 6. 환경 변수

```bash
# .env
REACT_APP_PEXELS_API_KEY=your_pexels_key
REACT_APP_PIXABAY_API_KEY=your_pixabay_key
REACT_APP_OPENWEATHER_API_KEY=your_openweather_key
```

---

## 7. 개발 명령어

```bash
npm start          # 개발 서버 실행 (localhost:3000)
npm run build      # 프로덕션 빌드
npm test           # 테스트 실행 (watch 모드)
npm test -- --watchAll=false  # 단일 테스트 실행
```

---

## 8. 구현 현황

| Phase | 제목 | 상태 | 진행률 |
|-------|------|------|--------|
| 01 | 프로젝트 초기 설정 | ✅ 완료 | 100% |
| 02 | Context 및 localStorage | ✅ 완료 | 100% |
| 03 | 배경 이미지 | ✅ 완료 | 100% |
| 04 | 시계/날짜 | ✅ 완료 | 100% |
| 05 | 날씨 | ✅ 완료 | 100% |
| 06 | 성경 구절/명언 | ✅ 완료 | 100% |
| 07 | 북마크 | ✅ 완료 | 100% |
| 08 | 작업 관리 위젯 | ✅ 완료 | 100% |
| 09 | 설정 모달 | ✅ 완료 | 100% |
| 10 | 다크모드 & 다국어 | ✅ 완료 | 100% |
| 11 | Theme Code | ⬜ 미시작 | 0% |
| 12 | Vercel 배포 | ⬜ 미시작 | 0% |
| 13 | 배경 이미지 즐겨찾기 | ✅ 완료 | 100% |
| 14 | 위젯 그리드 시스템 | ✅ 완료 | 100% |

---

## 9. 향후 계획

### 9.1 Phase 11: Theme Code
- Base64 인코딩 설정 내보내기
- Theme Code 가져오기 (복사/붙여넣기)
- 설정 공유 기능

### 9.2 Phase 12: Vercel 배포
- 환경 변수 설정
- 빌드 테스트 및 배포
- 커스텀 도메인 설정 (선택)

### 9.3 추가 고려 기능
- 위젯 투명도 조절
- 추가 시계 스타일
- 검색 위젯
- 캘린더 위젯
- 뽀모도로 타이머 위젯
- 배경 이미지 슬라이드쇼
- 키보드 단축키

---

## 10. 성능 고려사항

### 10.1 이미지 최적화
- 고해상도 이미지는 Pexels/Pixabay의 최적화된 URL 사용
- 썸네일은 별도 저해상도 URL 사용
- 업로드 이미지는 10MB 제한

### 10.2 상태 관리
- useReducer로 복잡한 상태 효율적 관리
- useCallback/useMemo로 불필요한 리렌더링 방지
- localStorage 저장은 상태 변경 시에만 수행

### 10.3 레이아웃
- CSS Transforms 사용 (useCSSTransforms)
- 그리드 셀 크기 동적 계산
- 화면 리사이즈 최적화

---

## 11. 접근성

### 11.1 키보드 접근성
- 모든 버튼에 적절한 `title` 속성
- 입력 필드 포커스 관리
- ESC/Enter 키 지원

### 11.2 시각적 접근성
- 충분한 색상 대비
- 아이콘과 텍스트 병용
- 호버/활성 상태 명확한 표시

---

*마지막 업데이트: 2025-12-04*
