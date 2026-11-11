# AI 5: Interaction Engineer — Execution Report

**Status:** COMPLETED  
**Primary Owner:** AI 5 (Interaction Engineer)  
**Reviewed By:** AI 0 (Chief Architect)  
**Date:** 2026-11-04  

---

## 1. Overview & Deliverables

AI 5는 MyPath365의 인터랙션 시스템 및 클라이언트 상태 관리 체계를 전면 구현하였습니다.
백엔드 서버 없이도 LocalStorage를 통해 사용자의 즐겨찾기, 읽기 진행률, To-do 완료 상태, 사용자 환경 설정을 영속적으로 관리하며, 차후 Supabase나 백엔드 API로 매끄럽게 확장할 수 있도록 저장 계층을 추상화하였습니다.

### 핵심 산출물:
1. **인메모리 클라이언트 검색 엔진 (`ClientSearchEngine`) & 검색 모달 (`SearchModal`)**:
   - `Cmd+K` / `Ctrl+K` 및 `Esc` 지원
   - 한국어 및 영문 토큰 분리 검색
   - 페이지 제목 가중치 부여 및 점수 기반 랭킹
   - 실시간 스니펫 컨텍스트 추출
2. **영속적 사용자 상태 관리 (`userStore` & `userStateManager`)**:
   - 즐겨찾기(Favorites) 등록/해제/토글/조회
   - 읽기 진행률(Reading Progress) 0~100% 추적 및 자동 클램핑
   - AI 3의 To-do 블록과 연동되는 To-do 상태 관리 (정적 원본 데이터 불변 보장)
   - 최근 방문 페이지(Recent Visits) 기록 (최대 20개 타임스탬프 저장)
   - 사용자 환경설정(테마, 폰트 크기, 사이드바 접힘 상태)
3. **견고한 안전 저장소 계층 (`safeLocalStorage`)**:
   - Key 네임스페이스(`mypath365_`), Schema Version Envelope (`version`, `timestamp`, `data`)
   - 손상된 JSON 파싱 예외 복구 및 Safe Fallback
   - 향후 마이그레이션을 위한 `migrateData` 파이프라인
4. **리액트 인터랙션 훅 및 UI 컴포넌트**:
   - `useSearch`, `useFavorites`, `useReadingProgress`, `useTodo`, `usePreferences`
   - `useKeyboardShortcut`, `useLocalStorage`, `useScrollPosition`
   - `SearchModal`, `FavoriteButton`, `ProgressBar`

---

## 2. In-Memory Search Engine & Modal

- **구현 위치**: `src/features/search/`
  - `searchEngine.ts`: `ISearchEngine` 인터페이스 구현체 `ClientSearchEngine`.
  - `useSearch.ts`: 디바운싱(80ms) 검색 훅.
  - `SearchModal.tsx`: Linear 감성의 미니멀 팝업 모달 (`Cmd+K` 토글, 키보드 방향키 이동 및 Enter 선택, Esc 닫기).
- **검색 알고리즘**:
  - 제목 + 블록 본문 텍스트(Paragraph, Heading, Todo, Table 등) 인덱싱.
  - 다중 키워드(AND 조건) 매칭 지원.
  - 대소문자 무시, 공백 정규화, 한국어 형태소 친화적 부분 문자열 매칭.
  - 제목 매칭 가중치(+60), 완전 일치(+100), 접두사 일치(+40).
  - 결과 일치 단어 전후 맥락 텍스트(Snippet) 자동 생성.

---

## 3. State Management & Persistence Strategy

- **구현 위치**: `src/stores/`
  - `safeStorage.ts`: `StorageAdapter` 기반의 안전한 LocalStorage 래퍼.
  - `createStore.ts`: 가벼운 경량 상태 스토어 생성기 (Zustand 호환 구조).
  - `userStateManager.ts`: 순수 비즈니스 로직 및 스토리지 동기화 관리자.
  - `userStore.ts`: `useSyncExternalStore` 기반 리액트 전역 스토어.
  - `uiStore.ts`: 모달 열림, 검색 쿼리, 사이드바 토글, 토스트 메시지 관리.

### 데이터 스토리지 구조:
```json
{
  "version": 1,
  "timestamp": "2026-11-04T12:45:00.000Z",
  "data": {
    "favorites": ["page-id-1", "page-id-2"],
    "completedTodos": {
      "todo-block-id-1": true
    },
    "readingProgress": {
      "page-id-1": 85
    },
    "preferences": {
      "theme": "system",
      "fontSize": "normal",
      "sidebarCollapsed": false
    },
    "lastVisitedPageId": "page-id-1",
    "recentVisits": [
      { "pageId": "page-id-1", "visitedAt": "2026-11-04T12:45:00.000Z" }
    ],
    "updatedAt": "2026-11-04T12:45:00.000Z"
  }
}
```

---

## 4. Interaction Hooks & Components

- **`useFavorites` & `<FavoriteButton />`**:
  - 즐겨찾기 상태 토글 및 별 모양 마이크로 인터랙션 (Active 시 Amber Gold 강조).
  - 접근성 ARIA 라벨 적용.
- **`useReadingProgress` & `<ProgressBar />`**:
  - 뷰포트 스크롤 비율(0~100%) 추적.
  - 최소 진척도(5%) 및 변화율(3% 이상) 스로틀링을 통한 로컬스토리지 과부하 방지.
  - 상단 3px Linear 스타일 진행 표시줄.
- **`useTodo`**:
  - AI 3의 ContentRenderer To-do 블록과 1:1 연동.
  - 원본 정적 데이터와 독립적으로 사용자 체크 상태를 오버라이드.
- **`usePreferences`**:
  - 다크모드/라이트모드/시스템 테마 변경 시 `document.documentElement[data-theme]`와 즉각 연동되어 AI 1의 디자인 토큰 활성화.
- **`useKeyboardShortcut`**:
  - `Cmd+K` / `Ctrl+K`, `Escape` 등 글로벌 단축키 바인딩.
  - Input, Textarea 등 포커스 중 충돌 방지 로직 기본 내장.

---

## 5. Exported APIs

### Stores (`src/stores/index.ts`)
- `userStore`, `useUserStore`
- `uiStore`, `useUIStore`
- `safeLocalStorage`
- `userStateManager`

### Features (`src/features/index.ts`)
- `searchEngine`, `useSearch`, `SearchModal`
- `useFavorites`, `FavoriteButton`
- `useReadingProgress`, `ProgressBar`
- `useTodo`
- `usePreferences`

### Hooks (`src/hooks/index.ts`)
- `useLocalStorage`
- `useKeyboardShortcut`
- `useScrollPosition`

---

## 6. Tests Executed & Results

- **테스트 파일**: `tests/unit/interaction.test.mjs`
- **실행 환경**: Node.js v26.13.0 Test Runner (`node --test`)
- **검증 항목**:
  1. `SafeLocalStorage - Set and Get Envelope Data`: 정상 버전 봉투 저장 및 역직렬화 통과.
  2. `SafeLocalStorage - Fallback on corrupt JSON`: 파싱 불가능한 JSON 입력 시 안전한 기본값 반환 검증.
  3. `SafeLocalStorage - Prefix matching clear and remove`: 타 애플리케이션 데이터 격리 검증.
  4. `ClientSearchEngine - Korean & English indexing and ranking`: 한국어 타이틀 검색, 본문 블록 검색, 다중 키워드 AND 검색, 대소문자 무시, 공백 및 예외 쿼리 100% 통과.
  5. `UserStateManager - Full interaction state cycle`: 즐겨찾기 CRUD, To-do 상태 변경, 읽기 진행률 클램핑, 환경설정 및 최근 방문 이력 저장 통과.
- **결과**: `✔ 5 passed, 0 failed`

---

## 7. Integration Notes for AI 2 & AI 3

- **AI 2 (Frontend Architect)**:
  - 글로벌 레이아웃에 `<SearchModal isOpen={isOpen} onClose={close} pages={allPages} onSelectResult={handleNavigate} />` 및 `<ProgressBar pageId={currentPageId} />`를 바로 연결하여 사용할 수 있습니다.
  - `useKeyboardShortcut('k', () => openSearchModal(), { ctrlOrCmd: true })`로 글로벌 단축키를 활성화할 수 있습니다.
  - 테마 스위처는 `usePreferences`의 `setTheme('light' | 'dark' | 'system')`를 호출하면 토큰이 자동 반영됩니다.
- **AI 3 (Content Engine Engineer)**:
  - To-do 블록 렌더링 시 `useTodo()` 훅의 `isCompleted(block.id, block.checked)`와 `toggleTodo(block.id)`를 이벤트 핸들러에 연결하면 원본 데이터 손상 없이 영속적인 체크박스 상호작용이 완성됩니다.
