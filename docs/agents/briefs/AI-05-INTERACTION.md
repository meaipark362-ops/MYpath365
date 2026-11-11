# Agent Mission Brief — AI 5: Interaction Engineer

**Agent ID:** AI 5  
**Role:** Interaction Engineer  
**Focus:** 검색, 즐겨찾기, 읽기 진행률, 클라이언트 상태 관리 및 저장  
**Document Version:** 1.0.0  
**Supervisor:** AI 0 (Chief Architect)  

---

## 1. Role & Objectives

AI 5는 MyPath365의 대화형 상호작용 경험을 Linear 수준의 완성도로 끌어올리는 역할을 맡습니다.
정적 콘텐츠를 오염시키지 않고 클라이언트 사이드에서 즉각 반응하는 검색 엔진, 즐겨찾기, 읽기 진행률, Zustand 스토어를 개발합니다.

### 핵심 목표
1. 인메모리 클라이언트 검색 엔진 및 검색 모달(`Cmd+K` / `Ctrl+K` 지원).
2. 즐겨찾기(Favorites/Bookmarks) 및 최근 본 문서 기능.
3. 스크롤 기반 문서 읽기 진행률(Reading Progress) 추적.
4. LocalStorage 기반 영속적 사용자 상태 저장소 (`userStore.ts`).

---

## 2. File Ownership & Workspace Boundaries

### AI 5 소유 영역 (Write Allowed)
- `src/features/**`
  - `search/` (`SearchModal.tsx`, `searchEngine.ts`, `useSearch.ts`)
  - `favorites/` (`FavoriteButton.tsx`, `useFavorites.ts`)
  - `progress/` (`ProgressBar.tsx`, `useReadingProgress.ts`)
- `src/stores/**` (`userStore.ts`, `uiStore.ts`)
- `src/hooks/**` (`useLocalStorage.ts`, `useScrollPosition.ts`, `useKeyboardShortcut.ts`)
- `docs/reports/AI-05-report.md` (자체 작업 보고서)

### 수정 금지 영역 (Read-Only)
- `src/app/**`, `src/pages/**`, `src/components/layout/**`, `src/types/**`
- 모든 루트 설정 파일 (`package.json`, `tsconfig.json` 등)

---

## 3. Interface Contracts & Specifications

AI 5는 `docs/architecture/interface-contracts.md`의 **Section 5 (Interaction Contract)**를 구현합니다:
- 스토어 인터페이스: `UserInteractionState`, `UserPreferences`
- 검색 인터페이스: `ISearchEngine`, `SearchResultItem`
- 키보드 단축키: `Cmd+K` (검색 모달 토글), `Esc` (모달 닫기)
- 진행률 연산: 뷰포트 스크롤 비율 계산 (0~100%) 및 로컬스토리지 디바운스 저장

---

## 4. Dependencies & Parallel Work Guide

- **선행 계약**: AI 4의 `PageItem`, `PageRegistryItem`.
- **병렬 작업 방식**: `docs/architecture/interface-contracts.md`에 명시된 가짜 페이지 데이터를 기반으로 검색 엔진 인덱싱 알고리즘과 Zustand 스토어를 독립적으로 테스트하고 완성합니다.

---

## 5. Definition of Done (완료 기준)

1. 인메모리 검색 엔진(`searchEngine.ts`) 및 모달(`SearchModal.tsx`) 완성.
2. Zustand 기반 `userStore.ts` 및 LocalStorage 동기화 완성.
3. 읽기 진행률 컴포넌트(`ProgressBar.tsx`) 및 훅 완성.
4. 키보드 단축키 훅(`useKeyboardShortcut.ts`) 구현 완료.
5. `docs/reports/AI-05-report.md`에 상태 모델, 검색 알고리즘 사양, 훅 사용 예시 기록 완료.

