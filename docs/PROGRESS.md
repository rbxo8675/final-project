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
| 02 | Context 및 localStorage | ✅ | 100% | 2025-12-02 | 2025-12-02 |
| 03 | 배경 이미지 | ✅ | 100% | 2025-12-02 | 2025-12-02 |
| 04 | 시계/날짜 | ✅ | 100% | 2025-12-02 | 2025-12-02 |
| 05 | 날씨 | ✅ | 100% | 2025-12-02 | 2025-12-02 |
| 06 | 성경 구절 | ✅ | 100% | 2025-12-02 | 2025-12-02 |
| 07 | 북마크 | ⬜ | 0% | - | - |
| 08 | 할 일 목록 | ⬜ | 0% | - | - |
| 09 | 설정 모달 | ⬜ | 0% | - | - |
| 10 | 다크모드 & 다국어 | ⬜ | 0% | - | - |
| 11 | Theme Code | ⬜ | 0% | - | - |
| 12 | Vercel 배포 | ⬜ | 0% | - | - |
| 13 | 배경 이미지 즐겨찾기 | ✅ | 100% | 2025-12-02 | 2025-12-02 |

---

## 상세 체크리스트

### Phase 01: 프로젝트 초기 설정
- [x] 프로젝트 구조 생성 (components, contexts, hooks, services, utils)
- [x] react-icons 설치
- [x] App.js 기본 레이아웃 설정
- [x] CSS 초기화 및 기본 스타일 변수 정의
- [x] .env 파일 설정

### Phase 02: Context 및 localStorage
- [x] AppContext 생성
- [x] Context Provider 구현
- [x] localStorage 유틸리티 생성 (storage.js)
- [x] Context와 localStorage 연동
- [x] useSettings 커스텀 훅 생성

### Phase 03: 배경 이미지
- [x] Unsplash API 서비스 구현
- [x] Background 컴포넌트 생성
- [x] 카테고리 선택 기능
- [x] 이미지 로딩 상태 처리

### Phase 04: 시계/날짜
- [x] Clock 컴포넌트 생성
- [x] 디지털(대) 스타일
- [x] 아날로그 스타일
- [x] 디지털(소) 스타일
- [x] 스타일 선택 기능 (settings에서 전환)

### Phase 05: 날씨
- [x] OpenWeatherMap API 서비스 구현
- [x] Weather 컴포넌트 생성
- [x] 위치 정보 획득 (Geolocation)
- [x] 날씨 아이콘 표시
- [x] 온도 단위 선택 (metric/imperial)

### Phase 06: 성경 구절
- [x] Bible API 서비스 구현
- [x] Quote 컴포넌트 생성
- [x] 랜덤 구절 표시
- [x] 번역본 선택 기능
- [x] 한글 성경 구절/명언 JSON 데이터
- [x] 성경/명언 타입 선택 (bible/quote/both)

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

### Phase 13: 배경 이미지 즐겨찾기
- [x] 현재 배경 이미지 즐겨찾기 추가 기능
- [x] 즐겨찾기 이미지 제거 기능
- [x] 로컬 이미지 업로드 기능
- [x] 즐겨찾기 갤러리 UI 구현
- [x] 랜덤/즐겨찾기 모드 전환
- [x] localStorage 저장 연동

---

## 변경 이력

| 날짜 | 내용 |
|------|------|
| 2025-12-02 | Phase 01 완료 - 프로젝트 초기 설정 (폴더 구조, react-icons, CSS 변수, .env) |
| 2025-12-02 | Phase 02 완료 - Context 및 localStorage (AppContext, storage.js, useSettings) |
| 2025-12-02 | Phase 03 완료 - 배경 이미지 (Unsplash API, Background 컴포넌트, useApi 훅) |
| 2025-12-02 | Phase 13 완료 - 배경 이미지 즐겨찾기 (하트 버튼, 갤러리 모달, 이미지 업로드, 랜덤/즐겨찾기 모드) |
| 2025-12-02 | Phase 04 완료 - 시계/날짜 (디지털 대/소, 아날로그, 다국어 지원) |
| 2025-12-02 | Phase 05 완료 - 날씨 (OpenWeatherMap API, Geolocation, 날씨 아이콘, 온도 단위) |
| 2025-12-02 | Phase 06 완료 - 성경 구절/명언 (Bible API, Quotable API, 한글 데이터, 타입 선택) |

---

## 메모

_작업 중 발견한 이슈나 메모사항을 기록합니다._
