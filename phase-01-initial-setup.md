# Phase 1: 프로젝트 초기 설정

## 목표
Create React App으로 프로젝트를 생성하고 기본 구조를 설정합니다.

## 작업 내용

### 1. 프로젝트 생성 확인
- Create React App이 이미 초기화되어 있는지 확인
- package.json 확인

### 2. 프로젝트 구조 생성
다음 폴더 구조를 생성합니다:
```
src/
├── components/
│   ├── Background/
│   ├── Clock/
│   ├── Weather/
│   ├── Quote/
│   ├── Bookmarks/
│   ├── TodoList/
│   └── Settings/
├── contexts/
├── hooks/
├── services/
├── utils/
└── App.js
```

### 3. 필요한 의존성 설치
```bash
npm install
```

추가로 필요한 패키지들:
```bash
npm install react-icons
```

### 4. 기본 App.js 설정
- 불필요한 Create React App 기본 코드 정리
- 기본 레이아웃 구조 설정
- CSS 초기화 (Reset CSS)

### 5. CSS Modules 설정
- App.module.css 파일 생성
- 기본 스타일 변수 정의 (색상, 폰트 등)

### 6. 환경 변수 설정
`.env` 파일 생성 및 API 키 설정:
```
REACT_APP_UNSPLASH_ACCESS_KEY=your_key
REACT_APP_OPENWEATHER_API_KEY=your_key
```

## 완료 조건
- [ ] 프로젝트가 `npm start`로 정상 실행됨
- [ ] 폴더 구조가 생성됨
- [ ] 기본 App.js가 깔끔하게 정리됨
- [ ] .env 파일이 설정됨 (.gitignore에 포함)

## 다음 단계
Phase 2: Context 및 localStorage 구현
