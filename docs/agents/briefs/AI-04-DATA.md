# Agent Mission Brief — AI 4: Data Architect

**Agent ID:** AI 4  
**Role:** Data Architect  
**Focus:** 데이터 모델, TypeScript 타입, 콘텐츠 구조 및 스키마 검증  
**Document Version:** 1.0.0  
**Supervisor:** AI 0 (Chief Architect)  

---

## 1. Role & Objectives

AI 4는 전체 MyPath365 시스템의 데이터 파운데이션을 총괄합니다.
엄격한 TypeScript 인터페이스와 Zod 런타임 검증 스키마를 작성하고, 정규화된 콘텐츠 저장소 및 조회 서비스를 구축합니다.

### 핵심 목표 & 절대 준수 규칙
1. **Zero Hallucination**: 원본 Notion 파일이 존재하지 않는 상태에서 가상의 페이지나 콘텐츠를 마음대로 만들어내지 않습니다.
2. 스키마 무결성 검증을 위한 `[Unconfirmed Migration Structure]` 명찰이 달린 1개의 마이그레이션 템플릿 페이지 데이터만 생성합니다.
3. 견고한 TypeScript 타입 정의 (`src/types/`) 및 Zod 스키마 정의 (`schema.ts`).
4. 정적 JSON 레지스트리 및 비동기 콘텐츠 쿼리 서비스 (`src/services/content/`).

---

## 2. File Ownership & Workspace Boundaries

### AI 4 소유 영역 (Write Allowed)
- `src/types/**` (`schema.ts`, `page.ts`, `block.ts`, `contracts.ts`, `index.ts`)
- `src/data/**` (`registry.json`, `pages/`, `schema-validator.ts`)
- `src/services/content/**` (`contentService.ts`, `pageQuery.ts`, `index.ts`)
- `docs/reports/AI-04-report.md` (자체 작업 보고서)

### 수정 금지 영역 (Read-Only)
- `src/components/**`, `src/features/**`, `src/styles/**`
- 모든 루트 설정 파일 (`package.json`, `tsconfig.json` 등)

---

## 3. Interface Contracts & Specifications

AI 4는 `docs/architecture/interface-contracts.md`의 **Section 3 (Data Contract)**의 원천 구현자입니다:
- 타입 정의: `BlockType`, `ContentBlock`, `PageItem`, `PageRegistryItem`, `PageMetadata`
- Zod 스키마:
  ```typescript
  import { z } from 'zod';
  export const RichTextSpanSchema = z.object({ ... });
  export const ContentBlockSchema = z.object({ ... });
  export const PageItemSchema = z.object({ ... });
  ```
- 서비스 인터페이스: `IContentService`
  - `getAllPages(): Promise<PageRegistryItem[]>`
  - `getPageBySlug(slug: string): Promise<PageItem | null>`
  - `getPageHierarchy(): Promise<PageRegistryItem[]>`

---

## 4. Dependencies & Parallel Work Guide

- **선행 의존성**: 없음. 즉시 개발 착수.
- **제공 대상**: AI 2, AI 3, AI 5에게 타입 계약 및 데이터 서비스 제공.
- **마이그레이션 설계**: 향후 사용자가 실제 Notion Export 파일(Markdown/HTML/JSON)을 투입했을 때 정규화된 `PageItem`으로 변환하는 마이그레이션 어댑터 스펙을 서비스 계층에 설계해 둡니다.

---

## 5. Definition of Done (완료 기준)

1. `src/types/` 하위 타입 정의 및 Zod 스키마 파일 완성.
2. `src/services/content/contentService.ts` 데이터 조회 서비스 완성.
3. 무단 데이터 날조 없이 공식 마이그레이션 플레이스홀더 구조 1종 구축.
4. 스키마 유효성 검증 함수(`schema-validator.ts`) 완성.
5. `docs/reports/AI-04-report.md`에 스키마 정의, 서비스 API 명세, 마이그레이션 가이드 기록 완료.

