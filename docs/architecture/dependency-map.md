# MyPath365 — Dependency Map & Parallel Execution Graph

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Visual Dependency Graph

```
[Phase 0~3: AI 0 Base Setup & Interface Contracts Approved]
                         │
      ┌──────────────────┼──────────────────────────────┐
      │                  │                              │
┌─────▼──────────┐ ┌─────▼──────────┐            ┌──────▼─────────┐
│ AI 1: Design   │ │ AI 4: Data     │            │ AI 6: Assets   │
│ - Design Tokens│ │ - Type Schemas │            │ - Placeholders │
│ - Atomic UI    │ │ - Page Blocks  │            │ - Image Loaders│
└─────┬──────────┘ └─────┬──────────┘            └──────┬─────────┘
      │                  │                              │
      │   ┌──────────────┴──────────────┐               │
      │   │                             │               │
      │ ┌─▼──────────────┐       ┌──────▼─────────┐     │
      │ │ AI 3: Content  │       │ AI 5: Inter-   │     │
      │ │ - Block Engine │       │     action     │     │
      │ │ - Renderer AST │       │ - Search Engine│     │
      │ └─┬──────────────┘       │ - Stores & DB  │     │
      │   │                      └──────┬─────────┘     │
      └───┼──────────────┬──────────────┘               │
          │              │                              │
        ┌─▼──────────────▼──────────────────────────────▼─┐
        │ AI 2: Frontend Architect                        │
        │ - App Layout, Router, Page Shells, TOC          │
        └────────────────────────┬────────────────────────┘
                                 │
        ┌────────────────────────▼────────────────────────┐
        │ AI 7: QA & Performance Engineer                 │
        │ - Schema Validation, Accessibility, Test Suites │
        └────────────────────────┬────────────────────────┘
                                 │
        ┌────────────────────────▼────────────────────────┐
        │ AI 8: Final Direct Integration                  │
        │ - Package lock unlock, Build verification       │
        └─────────────────────────────────────────────────┘
```

---

## 2. Dependency Matrix & Parallel Decoupling Strategy

| Agent | Direct Dependencies | How Parallelization is Achieved (No Waiting) |
|---|---|---|
| **AI 1 (Design)** | None (Pure Design) | CSS 변수와 UI 기본 컴포넌트 즉시 단독 개발 착수. |
| **AI 4 (Data)** | None (Domain Logic) | TypeScript 인터페이스 및 Zod 스키마, Mock 데이터 즉시 단독 개발 착수. |
| **AI 6 (Assets)** | None (Media Assets) | SVG 아이콘 세트, 폴백 이미지, 이미지 로더 헬퍼 즉시 개발 착수. |
| **AI 3 (Content)** | AI 4 (Block Schema) | `interface-contracts.md`에 명시된 `ContentBlock` 계약을 기준으로 자체 Mock AST 블록을 주입하여 독립 렌더러 구현. |
| **AI 5 (Interaction)** | AI 4 (Page Types) | `PageItem` 및 `PageRegistryItem` 계약 타입을 기반으로 인메모리 검색 엔진 및 Zustand 스토어 단독 구현. |
| **AI 2 (Frontend)** | AI 1, 3, 4, 5, 6 | 계약에 정의된 인터페이스 컴포넌트 스텁(Stub)과 라우팅 구조를 우선 구성하고 모듈을 슬롯 형태로 연결. |
| **AI 7 (QA)** | AI 1~6 Components | 단위 테스트 하네스와 접근성 감사 스크립트를 독립적으로 작성하고 검증 파이프라인 구축. |
| **AI 8 (Integration)**| AI 1~7 Completion | **모든 AI 1~7의 보고서가 제출된 후** 최종 실행. |

---

## 3. Strict Execution Phases

### PHASE 0: Discovery & Analysis (AI 0)
- 워크스페이스 현황 조사 (빈 디렉터리 확인, 도구 버전 확인).
- 원본 Notion 자산 존재 여부 확인 (미확인 상태 공식 기록).

### PHASE 1: Architecture & System Design (AI 0)
- 시스템 아키텍처 및 계층 분리 수립.
- 무단 콘텐츠 날조 방지 원칙 수립.

### PHASE 2: Contracts & File Ownership (AI 0)
- 6대 인터페이스 계약 수립.
- 파일 및 폴더 단일 소유권 확정.

### PHASE 3: Multi-Agent Readiness Verification (AI 0)
- 각 AI별 맞춤형 실행 브리프 작성 (`docs/agents/briefs/`).
- 독립 보고서 템플릿 준비 (`docs/reports/`).

### PHASE 4: Parallel Implementation (AI 1 ~ AI 7)
- 사용자가 각 AI 프롬프트를 전달하여 **AI 1~7 동시 병렬 작업 개시**.
- 각 AI는 자신의 소유 디렉터리만 수정.

### PHASE 5: Individual Reports (AI 1 ~ AI 7)
- 각 AI는 작업 완료 후 `docs/reports/AI-XX-report.md` 작성 및 종료.

### PHASE 6: Final Integration (AI 8)
- AI 8이 호출되어 설정 파일 잠금 해제, 통합 빌드, 누락 의존성 설치, 런타임 검증 수행.

### PHASE 7: QA Audit & Release Sign-Off (AI 7 & AI 0)
- 테스트 실행 결과 및 품질 기준 충족 여부 확인 후 릴리스 완료.
