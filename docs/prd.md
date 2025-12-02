# PRD: 나만의 시작페이지

## 개요
매일 새로운 영감과 생산성을 제공하는 개인화된 브라우저 시작페이지

## 기술 스택
| 항목 | 선택 |
|------|------|
| 프레임워크 | Create React App |
| 상태관리 | React Context |
| 스타일링 | CSS Modules |
| 배포 | Vercel |

## 핵심 기능

### 1. 배경 이미지 (Unsplash API)
- 사용자 카테고리 선택 (자연, 도시, 추상 등)
- 새로고침마다 새 이미지
- 즐겨찾기: 마음에 드는 이미지 저장
- 이미지 업로드: 사용자 로컬 이미지 업로드 지원

### 2. 성경 구절 (Bible API)
- 새로고침마다 랜덤 구절
- 번역본 선택 (개역한글, KJV, NIV 등)

### 3. 명언 (Quote API)
- 선택적 표시 (성경/명언 택1 또는 둘 다)

### 4. 시계/날짜
- 스타일 선택: 디지털(대), 아날로그, 디지털(소)

### 5. 날씨 (OpenWeatherMap API)
- 현재 위치 기반 날씨

### 6. 북마크
- 간단 링크 (아이콘 + URL, 5-10개)

### 7. 할 일 목록
- 심플 체크리스트 (추가/완료/삭제)

## UI/UX
- **디자인**: 모던 미니멀
- **다크모드**: 수동 전환
- **언어**: 한/영 전환
- **설정**: 모달 창

## 위젯 커스터마이징
- **위젯 ON/OFF**: 설정에서 원하는 위젯만 표시
- **위치 변경**: 드래그 앤 드롭으로 위젯 위치 조정
- **레이아웃 저장**: 사용자 레이아웃 localStorage에 저장

## 데이터 저장
- 기본: localStorage
- 선택: theme code로 내보내기/가져오기

## 프로젝트 구조
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
│   └── AppContext.js
├── hooks/
│   └── useApi.js
├── services/
│   ├── unsplash.js
│   ├── bible.js
│   ├── quote.js
│   └── weather.js
├── utils/
│   └── storage.js
└── App.js
```

## 구현 순서
1. 프로젝트 초기 설정
2. Context 및 localStorage
3. 배경 이미지
4. 시계/날짜
5. 날씨
6. 성경/명언
7. 북마크
8. 할 일 목록
9. 설정 모달
10. 다크모드 & 다국어
11. theme code 기능
12. Vercel 배포
13. 배경 이미지 즐겨찾기

