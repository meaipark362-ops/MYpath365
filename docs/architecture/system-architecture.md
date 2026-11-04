# MyPath365 — System Architecture

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Executive Summary & Design Philosophy

**MyPath365**는 기존 Notion 기반 지식 저장소의 구조화된 정보와 계층을 완벽히 보존하면서, Notion의 제약에서 벗어난 독립적이고 고품질의 웹 애플리케이션으로 재구축하는 프로젝트입니다.

### 4대 핵심 디자인 철학
1. **Premium Minimal**: 군더더기 없는 미니멀리즘과 숭고한 여백의 미학을 추구합니다.
2. **Apple-style Visual Sophistication**: 옵시디언(#101114)과 아이보리(#F6F6F3)를 기조로 한 정교한 컬러 팔레트, 미세한 서브픽셀 보더, 절제된 광택과 반사 효과를 적용합니다.
3. **Linear-level Interaction Polish**: 120fps를 목표로 하는 즉각적인 햅틱 반응성, 정교한 스프링 애니메이션(Motion), 마이크로 인터랙션 및 키보드 단축키 지원을 포함합니다.
4. **Editorial-style Content Readability**: 활자 중심의 잡지나 고급 출판물 수준의 가독성, 최적의 행간(1.6~1.75), 컬럼 너비(680px~760px), 활자 위계(Type Scale)를 제공합니다.

---

## 2. High-Level Architecture

시스템은 데이터 레이어, 콘텐츠 렌더링 엔진, 레이아웃/앱 셸, 인터랙션/상태 저장소, 에셋 최적화 파이프라인의 5개 독립 레이어로 분리됩니다.

```
┌────────────────────────────────────────────────────────┐
│                   App Shell & Router                   │ (AI 2: Frontend)
│  (Navigation, Sidebar, Header, Breadcrumbs, Responsive) │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
┌───────────▼──────────┐         ┌───────────▼───────────┐
│  Content View Engine │         │  Interaction Layer    │ (AI 5: Interaction)
│  (Block Tree Parser, │         │  (Search, Favorites,  │
│   Dynamic Component  │         │   Progress Tracker,   │
│   Factory)           │         │   Zustand Store)      │
│  (AI 3: Content)     │         └───────────┬───────────┘
└───────────┬──────────┘                     │
            │                                │
┌───────────▼────────────────────────────────▼───────────┐
│               Data & Contract Foundation               │ (AI 4: Data)
│  (Normalized Page Schema, Block AST, Static Registry)   │
└───────────┬────────────────────────────────┬───────────┘
            │                                │
┌───────────▼──────────┐         ┌───────────▼───────────┐
│ Design System & UI   │         │ Asset & Media Gateway │ (AI 6: Assets)
│ (Tokens, Atomic UI,  │         │ (Adaptive Image, Lazy │
│  Typography, Motion) │         │  Loader, Fallbacks)   │
│ (AI 1: Design)       │         └───────────────────────┘
└──────────────────────┘
```

---

## 3. Layer Separation & Separation of Concerns

### Layer 1: Data Contract & Domain (AI 4)
- **책임**: 순수 TypeScript 인터페이스 정의, JSON 데이터 스키마 검증(Zod), 정적 마이그레이션 구조체 관리.
- **원칙**: UI 프레임워크(React)에 의존하지 않는 순수 데이터 모델 계층.
- **미확인 데이터 처리**: 원본 Notion 데이터가 누락되었거나 미확인된 경우 `isUnconfirmed: true`, `unknown` fallback 블록을 생성하며 임의의 콘텐츠를 생성하지 않음.

### Layer 2: Design System & Primitives (AI 1)
- **책임**: CSS 디자인 토큰(CSS Variables), 원자적 UI 컴포넌트(Button, Badge, Tooltip, Modal, Card 등), Motion 애니메이션 프리셋.
- **원칙**: 비즈니스 로직 및 도메인 데이터(Page, Block)에 의존하지 않는 순수 프레젠테이션 컴포넌트.

### Layer 3: Content Rendering Engine (AI 3)
- **책임**: AST(Abstract Syntax Tree) 기반의 블록 트리 순회 및 다형성 렌더링 컴포넌트(`ContentRenderer`).
- **원칙**: 지원되는 16개 표준 블록(Paragraph, Heading, List, Toggle, Callout, Table 등) 및 `UnknownBlockFallback` 렌더링. 페이지 레이아웃이나 라우팅에 종속되지 않음.

### Layer 4: Application Shell & Pages (AI 2)
- **책임**: App Router, 글로벌 레이아웃, 사이드바, 헤더, 브레드크럼, 반응형 뷰포트 전환, 개별 페이지 뷰.
- **원칙**: AI 3의 `ContentRenderer`, AI 1의 UI 컴포넌트, AI 5의 상태 훅을 조합하는 최상위 조합(Orchestration) 레이어.

### Layer 5: Interaction & State Storage (AI 5)
- **책임**: 클라이언트 사이드 검색 엔진(인메모리 인덱싱), 즐겨찾기(Bookmarks/Favorites), 읽기 진행률(Reading Progress), 로컬 스토리지 영속화(Persistence).
- **원칙**: 정적 콘텐츠를 오염시키지 않고 사용자별 동적 상태(User State)를 완전히 분리하여 관리.

### Layer 6: Asset & Media Management (AI 6)
- **책임**: 반응형 이미지 래퍼, 에러 폴백 이미지, 스켈레톤 로더, 아이콘/폰트 리소스 경로 관리.
- **원칙**: 모든 이미지/미디어 태그는 직교 로더를 거쳐 안전한 플레이스홀더를 보장.

### Layer 7: Quality Assurance & Standards (AI 7)
- **책임**: 단위 테스트(Unit), E2E/컴포넌트 테스트, 웹 접근성(a11y: WCAG 2.1 AA), 성능 벤치마크(Core Web Vitals).

### Layer 8: Direct Integration (AI 8)
- **책임**: AI 1~7 산출물의 의존성 병합, 설정 파일(`package.json`, `vite.config.ts`, `tsconfig.json` 등) 락 해제 및 최종 빌드 검증.

---

## 4. Key Architectural Safeguards
1. **Zero Hallucination Policy**: 원본 Notion에서 명시적으로 확인되지 않은 데이터는 목업용 더미가 아닌 `[Unconfirmed Migration Structure]` 명찰을 달고 격리됩니다.
2. **Strict Headless Content**: 모든 Notion 블록은 정규화된 데이터 객체로 존재하며, JSX 하드코딩을 절대 금지합니다.
3. **No Direct Shared State Mutex**: 각 에이전트는 자신에게 할당된 폴더에만 쓰기 작업을 수행하며, 타인의 파일은 Read-Only 계약(Contract)으로만 참조합니다.
