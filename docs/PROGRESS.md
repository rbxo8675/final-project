# 프로젝트 진행 현황

## 상태 범례
- ⬜ 미시작 (Not Started)
- 🟡 진행중 (In Progress)
- ✅ 완료 (Completed)
- ⏸️ 보류 (On Hold)

---

## Phase 진행 현황

| Phase | 제목 | 상태 | 진행률 | 시작일 | 완료일 |
|-------|------|------|--------|--------|--------|
| 01 | 프로젝트 초기 설정 | ✅ | 100% | 2025-12-02 | 2025-12-02 |
| 02 | Context 및 localStorage | ⬜ | 0% | - | - |
| 03 | 배경 이미지 | ⬜ | 0% | - | - |
| 04 | 시계/날짜 | ⬜ | 0% | - | - |
| 05 | 날씨 | ⬜ | 0% | - | - |
| 06 | 성경 구절 | ⬜ | 0% | - | - |
| 07 | 북마크 | ⬜ | 0% | - | - |
| 08 | 할 일 목록 | ⬜ | 0% | - | - |
| 09 | 설정 모달 | ⬜ | 0% | - | - |
| 10 | 다크모드 & 다국어 | ⬜ | 0% | - | - |
| 11 | Theme Code | ⬜ | 0% | - | - |
| 12 | Vercel 배포 | ⬜ | 0% | - | - |

---

## 상세 체크리스트

### Phase 01: 프로젝트 초기 설정
- [x] 프로젝트 구조 생성 (components, contexts, hooks, services, utils)
- [x] react-icons 설치
- [x] App.js 기본 레이아웃 설정
- [x] CSS 초기화 및 기본 스타일 변수 정의
- [x] .env 파일 설정

### Phase 02: Context 및 localStorage
- [ ] AppContext 생성
- [ ] Context Provider 구현
- [ ] localStorage 유틸리티 생성 (storage.js)
- [ ] Context와 localStorage 연동
- [ ] useSettings 커스텀 훅 생성

### Phase 03: 배경 이미지
- [ ] Unsplash API 서비스 구현
- [ ] Background 컴포넌트 생성
- [ ] 카테고리 선택 기능
- [ ] 이미지 로딩 상태 처리

### Phase 04: 시계/날짜
- [ ] Clock 컴포넌트 생성
- [ ] 디지털(대) 스타일
- [ ] 아날로그 스타일
- [ ] 디지털(소) 스타일
- [ ] 스타일 선택 기능

### Phase 05: 날씨
- [ ] OpenWeatherMap API 서비스 구현
- [ ] Weather 컴포넌트 생성
- [ ] 위치 정보 획득 (Geolocation)
- [ ] 날씨 아이콘 표시
- [ ] 온도 단위 선택 (metric/imperial)

### Phase 06: 성경 구절
- [ ] Bible API 서비스 구현
- [ ] Quote 컴포넌트 생성
- [ ] 랜덤 구절 표시
- [ ] 번역본 선택 기능

### Phase 07: 북마크
- [ ] Bookmarks 컴포넌트 생성
- [ ] 북마크 추가/삭제 기능
- [ ] 파비콘 표시
- [ ] 드래그 앤 드롭 정렬

### Phase 08: 할 일 목록
- [ ] TodoList 컴포넌트 생성
- [ ] 할 일 추가/완료/삭제 기능
- [ ] 완료 항목 스타일링

### Phase 09: 설정 모달
- [ ] Settings 컴포넌트 생성
- [ ] 위젯 ON/OFF 토글
- [ ] 각 위젯별 설정 옵션
- [ ] 설정 저장/초기화

### Phase 10: 다크모드 & 다국어
- [ ] 다크모드 CSS 변수 설정
- [ ] 테마 전환 기능
- [ ] i18n 시스템 구현
- [ ] 한/영 번역 파일 작성

### Phase 11: Theme Code
- [ ] Theme Code 생성 기능 (Base64 인코딩)
- [ ] Theme Code 가져오기 기능
- [ ] 복사/붙여넣기 UI

### Phase 12: Vercel 배포
- [ ] 환경 변수 설정
- [ ] 빌드 테스트
- [ ] Vercel 배포
- [ ] 커스텀 도메인 설정 (선택)

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2025-12-02 | Phase 01 완료 - 프로젝트 초기 설정 (폴더 구조, react-icons, CSS 변수, .env) |

---

## 메모

_작업 중 발견한 이슈나 메모사항을 기록합니다._
