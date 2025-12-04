# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

개인화된 브라우저 시작페이지 - 배경 이미지, 시계, 날씨, 명언/성경구절, 북마크, 할 일 목록 등의 위젯을 제공하는 React 애플리케이션.

## 개발 명령어

```bash
npm start          # 개발 서버 실행 (localhost:3000)
npm run build      # 프로덕션 빌드
npm test           # 테스트 실행 (watch 모드)
npm test -- --watchAll=false  # 단일 테스트 실행
```

## 기술 스택

- **프레임워크**: Create React App (React 19)
- **상태관리**: React Context + useReducer
- **스타일링**: CSS Modules
- **그리드 시스템**: react-grid-layout (위젯 드래그/리사이즈)
- **배포**: Vercel

## 아키텍처

### 핵심 디렉토리 구조
```
src/
├── components/
│   ├── Background/     # Pixabay/Pexels 배경 이미지 + 즐겨찾기 갤러리
│   ├── Clock/          # 시계 (DigitalLarge, DigitalSmall, Analog)
│   ├── Weather/        # OpenWeatherMap 날씨
│   ├── Quote/          # 성경구절/명언
│   ├── Bookmarks/      # 북마크 링크 (3가지 크기)
│   ├── TodoList/       # 할 일 목록
│   ├── StickyNote/     # 스티키 노트 (6가지 색상)
│   ├── Kanban/         # 칸반 보드 (2컬럼 + 완료 드롭존)
│   ├── WidgetGrid/     # react-grid-layout 기반 위젯 그리드
│   └── Settings/       # 설정 사이드바
├── contexts/           # AppContext (전역 상태)
├── hooks/              # useSettings, useApi
├── services/           # API (imageApi, weather, quote)
├── data/               # 한글 명언/성경구절 JSON
└── utils/              # storage (localStorage), indexedDB
```

### 위젯 시스템

**인스턴스 기반 구조**: 동일 타입 위젯을 여러 개 추가 가능
- `widgetInstances`: `[{ id, type, settings }]` - 위젯 인스턴스 목록
- `layout`: react-grid-layout 레이아웃 배열 (`[{ i, x, y, w, h, minW, minH }]`)
- `widgetData`: `{ [widgetId]: data }` - 위젯별 데이터 (todo, sticky, kanban용)

**위젯 타입**: clock, weather, quote, bookmarks, todo, sticky, kanban

**편집 모드**: `uiSettings.editMode` - 위젯 추가/이동/삭제 토글

### 전역 상태 (AppContext)
- 테마 (`light`/`dark`), 언어 (`ko`/`en`), 위젯 스타일 (`glass`/`solid`/`minimal`/`neon`/`frosted`)
- 위젯 인스턴스 및 레이아웃
- 배경 이미지 즐겨찾기 및 모드 (`random`/`favorite`)
- 북마크, 할 일, 위젯 데이터

### 데이터 저장
- localStorage: 설정 및 데이터 영속화 (`startpage-settings` 키)
- Theme Code: Base64 인코딩된 설정 내보내기/가져오기

## 환경 변수

`.env` 파일에 API 키 설정:
```
REACT_APP_PIXABAY_API_KEY=your_key
REACT_APP_PEXELS_API_KEY=your_key
REACT_APP_OPENWEATHER_API_KEY=your_key
```

## 문서

`docs/` 폴더:
- `PROGRESS.md` - 진행 현황 (상태, 체크리스트)
- `prd.md` - 제품 요구사항 정의서
- `phase-01~14.md` - Phase별 상세 구현 스펙

### 진행 현황 관리
- 작업 완료 시 `docs/PROGRESS.md` 체크리스트 업데이트 필수
