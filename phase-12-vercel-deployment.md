# Phase 12: Vercel 배포

## 목표
프로젝트를 Vercel에 배포하여 실제 사용 가능한 웹 애플리케이션으로 만듭니다.

## 작업 내용

### 1. 배포 전 준비

#### 환경 변수 정리
`.env` 파일 확인 및 정리

```bash
# .env (로컬 개발용)
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_key
REACT_APP_OPENWEATHER_API_KEY=your_weather_key
```

#### .gitignore 확인
```
# dependencies
/node_modules

# testing
/coverage

# production
/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

#### package.json 확인
```json
{
  "name": "my-startpage",
  "version": "1.0.0",
  "private": true,
  "homepage": ".",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

### 2. 빌드 테스트

#### 로컬에서 프로덕션 빌드
```bash
npm run build
```

#### 빌드 결과 확인
- `build` 폴더가 생성되었는지 확인
- 빌드 크기 확인 (최적화 필요 시)

#### 로컬에서 빌드 테스트 (선택사항)
```bash
npm install -g serve
serve -s build
```

브라우저에서 `http://localhost:3000` 접속하여 확인

### 3. GitHub 저장소 생성

#### Git 초기화 (아직 안 했다면)
```bash
git init
git add .
git commit -m "Initial commit"
```

#### GitHub에 저장소 생성
1. GitHub.com에서 새 저장소 생성
2. 로컬 저장소와 연결

```bash
git remote add origin https://github.com/your-username/my-startpage.git
git branch -M main
git push -u origin main
```

### 4. Vercel 배포

#### 방법 1: Vercel 웹사이트에서 배포

1. **Vercel 계정 생성**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "New Project" 클릭
   - GitHub 저장소 연결
   - 저장소 선택 (my-startpage)

3. **프로젝트 설정**
   - Framework Preset: `Create React App` (자동 감지됨)
   - Build Command: `npm run build` (자동 설정됨)
   - Output Directory: `build` (자동 설정됨)

4. **환경 변수 설정**
   - "Environment Variables" 섹션에서 추가
   - `REACT_APP_UNSPLASH_ACCESS_KEY`: your_key
   - `REACT_APP_OPENWEATHER_API_KEY`: your_key

5. **배포 시작**
   - "Deploy" 클릭
   - 배포 완료까지 대기 (1-2분)

#### 방법 2: Vercel CLI로 배포

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 5. 도메인 설정 (선택사항)

#### Vercel 기본 도메인
- `your-project.vercel.app` 형식으로 자동 생성

#### 커스텀 도메인 연결
1. Vercel 대시보드 > Settings > Domains
2. 도메인 추가 (예: `mystartpage.com`)
3. DNS 설정 (Vercel에서 제공하는 지침 따르기)

### 6. 배포 후 확인 사항

#### 기능 테스트
- [ ] 모든 위젯이 정상 작동
- [ ] API 호출이 정상 작동 (Unsplash, Weather)
- [ ] localStorage 저장/불러오기
- [ ] 다크모드 전환
- [ ] 언어 전환
- [ ] 북마크 추가/삭제
- [ ] 할 일 추가/완료/삭제
- [ ] 설정 저장
- [ ] Theme Code 내보내기/가져오기

#### 성능 확인
- Lighthouse 점수 확인
- 로딩 속도 확인
- 모바일 반응성 확인

#### 브라우저 호환성
- Chrome
- Firefox
- Safari
- Edge

### 7. 지속적 배포 설정

#### 자동 배포 설정
Vercel은 기본적으로 GitHub에 푸시할 때마다 자동으로 배포됩니다.

- `main` 브랜치: 프로덕션 배포
- 다른 브랜치: 프리뷰 배포

#### 배포 브랜치 제한 (선택사항)
Vercel 대시보드 > Settings > Git에서 설정

### 8. 성능 최적화

#### 이미지 최적화
```bash
npm install sharp
```

#### 코드 스플리팅
```javascript
// React.lazy로 컴포넌트 지연 로딩
const Settings = React.lazy(() => import('./components/Settings/Settings'));

// Suspense로 감싸기
<Suspense fallback={<div>Loading...</div>}>
  <Settings />
</Suspense>
```

#### 빌드 크기 분석
```bash
npm install --save-dev source-map-explorer

# package.json에 추가
"scripts": {
  "analyze": "source-map-explorer 'build/static/js/*.js'"
}

npm run build
npm run analyze
```

### 9. SEO 및 메타 태그

#### public/index.html 업데이트
```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#3b82f6" />
    <meta
      name="description"
      content="매일 새로운 영감과 생산성을 제공하는 개인화된 브라우저 시작페이지"
    />
    <meta name="keywords" content="시작페이지, 브라우저, 생산성, 북마크, 할일목록" />
    <meta name="author" content="Your Name" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="나만의 시작페이지" />
    <meta property="og:description" content="매일 새로운 영감과 생산성을 제공하는 개인화된 브라우저 시작페이지" />
    <meta property="og:image" content="%PUBLIC_URL%/og-image.jpg" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="나만의 시작페이지" />
    <meta name="twitter:description" content="매일 새로운 영감과 생산성을 제공하는 개인화된 브라우저 시작페이지" />

    <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />

    <title>나만의 시작페이지</title>
  </head>
  <body>
    <noscript>이 앱을 실행하려면 JavaScript를 활성화해야 합니다.</noscript>
    <div id="root"></div>
  </body>
</html>
```

#### Favicon 생성
- https://favicon.io/ 또는 https://realfavicongenerator.net/ 사용
- 생성된 파일들을 `public/` 폴더에 추가

### 10. PWA 설정 (선택사항)

#### manifest.json 업데이트
```json
{
  "short_name": "시작페이지",
  "name": "나만의 시작페이지",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff"
}
```

### 11. 모니터링 및 분석 (선택사항)

#### Vercel Analytics
```bash
npm install @vercel/analytics
```

```javascript
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      {/* 앱 컴포넌트 */}
      <Analytics />
    </>
  );
}
```

#### Google Analytics (선택사항)
```javascript
// Google Analytics 추가
```

### 12. README 작성

#### README.md 생성
```markdown
# 나만의 시작페이지

매일 새로운 영감과 생산성을 제공하는 개인화된 브라우저 시작페이지

## 기능

- 🖼️ 배경 이미지 (Unsplash)
- ⏰ 시계/날짜 (3가지 스타일)
- 🌤️ 날씨 정보
- 📖 성경 구절 / 명언
- 🔖 북마크
- ✅ 할 일 목록
- 🌓 다크모드
- 🌐 다국어 (한/영)
- 💾 Theme Code로 설정 공유

## 배포

https://your-project.vercel.app

## 로컬 실행

\`\`\`bash
npm install
npm start
\`\`\`

## 환경 변수

\`\`\`
REACT_APP_UNSPLASH_ACCESS_KEY=
REACT_APP_OPENWEATHER_API_KEY=
\`\`\`

## 기술 스택

- React (Create React App)
- CSS Modules
- Context API
- Vercel

## 라이선스

MIT
```

### 13. 최종 체크리스트

배포 전:
- [ ] 모든 기능 테스트 완료
- [ ] 환경 변수 설정 확인
- [ ] .gitignore 확인
- [ ] 불필요한 console.log 제거
- [ ] 에러 처리 완료
- [ ] 빌드 에러 없음

배포 후:
- [ ] 프로덕션 URL 접속 확인
- [ ] 모든 API 정상 작동
- [ ] 모바일 반응형 확인
- [ ] 성능 점수 확인 (Lighthouse)
- [ ] 브라우저 호환성 확인

## 완료!

축하합니다! 프로젝트가 성공적으로 배포되었습니다.

## 추가 개선 사항

- [ ] 사용자 피드백 수집
- [ ] 버그 수정 및 개선
- [ ] 새로운 기능 추가
- [ ] 성능 최적화
- [ ] 접근성 개선
- [ ] 문서화 개선

## 유지보수

- 정기적인 의존성 업데이트
- 보안 패치 적용
- 사용자 피드백 반영
- 성능 모니터링
