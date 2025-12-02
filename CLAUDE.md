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
- **상태관리**: React Context
- **스타일링**: CSS Modules
- **배포**: Vercel

## 아키텍처

### 계획된 디렉토리 구조
```
src/
├── components/       # UI 컴포넌트
│   ├── Background/   # Unsplash 배경 이미지
│   ├── Clock/        # 시계/날짜 (디지털, 아날로그)
│   ├── Weather/      # OpenWeatherMap 날씨
│   ├── Quote/        # 성경구절/명언
│   ├── Bookmarks/    # 북마크 링크
│   ├── TodoList/     # 할 일 목록
│   └── Settings/     # 설정 모달
├── contexts/         # React Context (AppContext)
├── hooks/            # 커스텀 훅 (useApi, useSettings)
├── services/         # API 서비스 (unsplash, bible, quote, weather)
└── utils/            # 유틸리티 (storage - localStorage 관리)
```

### 전역 상태 (AppContext)
- 테마 (`light`/`dark`), 언어 (`ko`/`en`)
- 위젯 설정 (enabled, 개별 옵션)
- 위젯 레이아웃 (드래그 앤 드롭 위치)
- 북마크, 할 일 목록 데이터

### 데이터 저장
- localStorage로 설정 및 데이터 영속화
- Theme Code: Base64 인코딩된 설정 내보내기/가져오기 기능

## 환경 변수

`.env` 파일에 API 키 설정 필요:
```
REACT_APP_UNSPLASH_ACCESS_KEY=your_key
REACT_APP_OPENWEATHER_API_KEY=your_key
```

## 문서

모든 기획/설계 문서는 `docs/` 폴더에 위치:

```
docs/
├── PROGRESS.md          # 진행 현황 추적 (상태, 체크리스트)
├── prd.md               # 제품 요구사항 정의서
└── phase-01~12.md       # 각 Phase별 상세 구현 스펙
```

### 진행 현황 관리
- `docs/PROGRESS.md`에서 전체 진행률 및 상세 체크리스트 확인
- 작업 완료 시 해당 Phase의 상태와 체크리스트 업데이트 필수
- 변경 이력 섹션에 주요 작업 내용 기록
