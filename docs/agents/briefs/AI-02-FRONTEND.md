# Agent Mission Brief — AI 2: Frontend Architect

**Agent ID:** AI 2  
**Role:** Frontend Architect  
**Focus:** 앱 구조, 레이아웃, 라우팅 및 페이지 구현  
**Document Version:** 1.0.0  
**Supervisor:** AI 0 (Chief Architect)  

---

## 1. Role & Objectives

AI 2는 MyPath365의 최상위 애플리케이션 셸, 글로벌 레이아웃, 반응형 내비게이션, 그리고 라우팅 페이지를 구축합니다.
사용자가 정보를 탐색하고 읽는 전체 사용자 여정을 매끄럽게 연결합니다.

### 핵심 목표
1. 유연한 글로벌 레이아웃 구축 (`AppLayout`, `Sidebar`, `Header`, `Breadcrumb`, `TableOfContents`).
2. React Router 기반 라우팅 시스템 (`HomePage`, `ContentPage`, `SearchPage`, `FavoritesPage`, `NotFoundPage`).
3. 모바일, 태블릿, 데스크톱 반응형 뷰포트 대응.
4. AI 3의 `ContentRenderer`, AI 1의 UI 컴포넌트, AI 5의 스토어 및 검색 기능을 조합하는 통합 셸 구현.

---

## 2. File Ownership & Workspace Boundaries

### AI 2 소유 영역 (Write Allowed)
- `src/app/**` (예: `App.tsx`, `routes.tsx`, `providers.tsx`)
- `src/pages/**` (예: `HomePage.tsx`, `ContentPage.tsx`, `SearchPage.tsx`, `FavoritesPage.tsx`, `NotFoundPage.tsx`)
- `src/components/layout/**` (예: `AppLayout.tsx`, `Sidebar.tsx`, `Header.tsx`, `Breadcrumb.tsx`, `TableOfContents.tsx`, `index.ts`)
- `docs/reports/AI-02-report.md` (자체 작업 보고서)

### 수정 금지 영역 (Read-Only)
- `src/components/content/**` (AI 3 영역), `src/types/**` (AI 4 영역), `src/features/**` (AI 5 영역)
- 모든 루트 설정 파일 (`package.json`, `tsconfig.json`, `src/main.tsx` 등)

---

## 3. Interface Contracts & Specifications

AI 2는 다음 계약을 소비자로 참조합니다:
- `docs/architecture/interface-contracts.md`:
  - **Design Contract (AI 1)**: `src/components/ui/` 컴포넌트 및 CSS 클래스 사용.
  - **Data Contract (AI 4)**: `PageItem`, `PageRegistryItem`, `IContentService` 사용.
  - **Content Contract (AI 3)**: `<ContentRenderer blocks={page.blocks} />` 연동.
  - **Interaction Contract (AI 5)**: `useUserStore`, `useReadingProgress`, 검색 모달 연동.

---

## 4. Dependencies & Parallel Work Guide

- **병렬 개발 전략**:
  - AI 3, 4, 5가 구현 중일 때는 `interface-contracts.md`에 명시된 인터페이스 스펙을 기준으로 임시 Mock Props나 가짜 데이터를 주입하여 레이아웃과 라우터를 먼저 완성합니다.
  - 타인의 미완성 파일에 직접 코드를 넣지 마십시오.

---

## 5. Definition of Done (완료 기준)

1. `AppLayout`, `Sidebar`, `Header`, `Breadcrumb`, `TableOfContents` 구현 완료.
2. 5개 핵심 라우트 페이지 컴포넌트 구현 완료.
3. 반응형 3단/2단 레이아웃 전환 및 모바일 내비게이션 드로어 지원.
4. Notion 미확인 페이지 방문 시 안전한 404/안내 뷰 제공.
5. `docs/reports/AI-02-report.md`에 페이지 및 레이아웃 구조, 스크린샷 가이드, 라우트 매핑 기록 완료.

