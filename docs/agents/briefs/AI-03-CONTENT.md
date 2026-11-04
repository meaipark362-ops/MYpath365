# Agent Mission Brief — AI 3: Content Engine Engineer

**Agent ID:** AI 3  
**Role:** Content Engine Engineer  
**Focus:** Notion 형식의 구조화된 콘텐츠 렌더링 엔진  
**Document Version:** 1.0.0  
**Supervisor:** AI 0 (Chief Architect)  

---

## 1. Role & Objectives

AI 3은 정규화된 Notion AST(Abstract Syntax Tree) 블록 데이터를 받아 고품질 에디토리얼 스타일의 웹 문서로 변환하는 콘텐츠 렌더링 엔진을 구축합니다.
콘텐츠와 UI를 철저히 분리하며, Notion 블록을 React 컴포넌트에 절대 하드코딩하지 않습니다.

### 핵심 목표
1. 메인 렌더러 컴포넌트 구축 (`src/components/content/ContentRenderer.tsx`).
2. 블록 디스패처 및 16개 표준 Notion 블록 렌더러 구현.
3. 알 수 없는 블록을 조용히 누락시키지 않는 `UnknownBlock` 폴백 컴포넌트 구현.
4. RichText 스팬(Bold, Italic, Link, Inline Code, Color) 파싱 및 렌더링.

---

## 2. File Ownership & Workspace Boundaries

### AI 3 소유 영역 (Write Allowed)
- `src/components/content/**`
  - `ContentRenderer.tsx`
  - `BlockDispatcher.tsx`
  - `blocks/` (Paragraph, Heading, List, Todo, Toggle, Callout, Quote, Divider, Table, Code, Image, Video, Bookmark, ChildPage, UnknownBlock 등)
  - `index.ts`
- `docs/reports/AI-03-report.md` (자체 작업 보고서)

### 수정 금지 영역 (Read-Only)
- `src/app/**`, `src/pages/**`, `src/types/**`, `src/data/**`
- 모든 루트 설정 파일 (`package.json`, `tsconfig.json` 등)

---

## 3. Interface Contracts & Specifications

AI 3은 `docs/architecture/interface-contracts.md`의 **Section 3 (Data Contract)** 및 **Section 4 (Content Contract)**를 준수합니다:
- 입력 데이터: `ContentBlock[]`
- RichText 지원: bold, italic, strikethrough, underline, code, color, href
- 토글(ToggleBlock) 및 할 일(TodoBlock) 대화형 상태 처리:
  - Todo 클릭 시 AI 5의 상호작용 스토어와 연동할 수 있도록 이벤트 콜백(`onBlockAction`) 인터페이스 제공.
- 미지원 블록 처리:
  - 미확인 데이터 누락 금지. `UnknownBlock`에 원본 JSON 및 마이그레이션 안내 문구 표시.

---

## 4. Dependencies & Parallel Work Guide

- **선행 계약**: AI 4의 `ContentBlock` 타입 정의.
- **병렬 작업 방식**: `docs/architecture/interface-contracts.md`에 명시된 블록 정의를 기준으로 자체 Mock 블록 리스트를 만들어 단위 테스트 및 렌더링을 검증합니다.

---

## 5. Definition of Done (완료 기준)

1. `ContentRenderer.tsx` 및 `BlockDispatcher.tsx` 구현 완료.
2. 16개 표준 블록 및 `UnknownBlock` 렌더러 구현 완료.
3. 중첩된 블록(Nested Children: 예: 하위 불릿, 토글 내부 블록) 재귀 렌더링 지원.
4. 에디토리얼 타이포그래피 규칙(행간 1.7, 가독성 여백) 준수.
5. `docs/reports/AI-03-report.md`에 지원 블록 목록, 렌더링 예시, 폴백 정책 기록 완료.
