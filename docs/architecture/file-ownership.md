# MyPath365 — File Ownership & Governance Matrix

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Core Principles of Ownership

1. **단일 주 소유자 원칙 (Single Ownership Rule)**:
   - 모든 구현 파일과 디렉터리는 정확히 **한 명의 주 소유자(Primary Owner)**를 가집니다.
   - 소유권이 명시되지 않은 파일은 임의로 생성하거나 수정할 수 없습니다.

2. **읽기 전용 계약 참조 (Read-Only Contract Reference)**:
   - 다른 AI 소유 영역의 파일은 오직 `import type` 또는 공통 Contract 인터페이스를 통해서만 참조합니다.
   - 타인의 구현 코드를 직접 수정하는 행위는 엄격히 금지됩니다.

3. **변경 요청서 프로토콜 (RFC / Change Request Protocol)**:
   - 타인 영역의 인터페이스 수정이 필요한 경우 직접 고치지 않고, 보고서의 `Change Request` 섹션에 명시하거나 해당 AI에게 변경을 요청합니다.

---

## 2. Comprehensive Ownership Matrix

| 디렉터리 / 파일 경로 | 주 소유자 | 보조 검증자 | 목적 및 설명 |
|---|---|---|---|
| `README.md` | **AI 0** | AI 8 | 프로젝트 개요, 오케스트레이션 지침 및 시스템 진입점 |
| `docs/architecture/` | **AI 0** | AI 7, 8 | 시스템 아키텍처, 계약 규격, 의존성 맵, 거버넌스 규칙 |
| `docs/agents/briefs/` | **AI 0** | - | 각 AI 1~8 전용 미션 및 인터페이스 브리프 |
| `docs/reports/AI-0-architecture-report.md` | **AI 0** | - | 총괄 아키텍트 현황 분석 및 오케스트레이션 보고서 |
| `src/styles/` | **AI 1** | AI 2, 7 | CSS 디자인 토큰, 글로벌 타이포그래피, 테마 변수, 리셋 |
| `src/components/ui/` | **AI 1** | AI 2, 3, 7 | 원자적 UI 컴포넌트 (Button, Badge, Modal, Tooltip 등) |
| `docs/reports/AI-01-report.md` | **AI 1** | AI 0 | Design System 구현 완료 보고서 |
| `src/app/` | **AI 2** | AI 8 | 애플리케이션 진입 조합 (App.tsx, routes.tsx, providers) |
| `src/pages/` | **AI 2** | AI 7 | 메인 화면, 콘텐츠 뷰어 페이지, 404 등 라우트 페이지 |
| `src/components/layout/` | **AI 2** | AI 1, 7 | AppLayout, Sidebar, Header, Breadcrumbs, TOC |
| `docs/reports/AI-02-report.md` | **AI 2** | AI 0 | Frontend App Shell 구현 완료 보고서 |
| `src/components/content/` | **AI 3** | AI 2, 7 | Notion AST 기반 ContentRenderer 및 16개 표준 블록 컴포넌트 |
| `docs/reports/AI-03-report.md` | **AI 3** | AI 0 | Content Engine 구현 완료 보고서 |
| `src/types/` | **AI 4** | AI 2, 3, 5 | Page, Block, Metadata, Contract Zod/TS 타입 스키마 |
| `src/data/` | **AI 4** | AI 3, 7 | 정규화된 페이지 데이터(JSON), 레지스트리 인덱스, 검증기 |
| `src/services/content/` | **AI 4** | AI 2, 3 | 콘텐츠 쿼리 서비스 (getPageBySlug, getHierarchy 등) |
| `docs/reports/AI-04-report.md` | **AI 4** | AI 0 | Data Architecture & Model 구현 완료 보고서 |
| `src/features/` | **AI 5** | AI 2, 7 | 검색 모달, 즐겨찾기, 읽기 진행률 UI 및 로직 |
| `src/stores/` | **AI 5** | AI 2 | Zustand 기반 전역 상태 (UserStore, UIStore) |
| `src/hooks/` | **AI 5** | AI 2, 3 | 로컬스토리지, 단축키, 스크롤 인터랙션 훅 |
| `docs/reports/AI-05-report.md` | **AI 5** | AI 0 | Interaction & State 구현 완료 보고서 |
| `public/assets/` | **AI 6** | AI 7 | 폰트, SVG 아이콘, 플레이스홀더 이미지, 최적화 리소스 |
| `src/services/assets/` | **AI 6** | AI 2, 3 | 이미지 지연 로딩 헬퍼, 플레이스홀더 생성기 |
| `docs/reports/AI-06-report.md` | **AI 6** | AI 0 | Asset & Media 최적화 완료 보고서 |
| `tests/` | **AI 7** | AI 8 | 단위 테스트, 접근성(a11y) 검증, 시각적 회귀 테스트 |
| `scripts/qa/` | **AI 7** | AI 8 | 품질 검사, 번들 사이즈 분석, 스키마 유효성 검사 스크립트 |
| `docs/reports/AI-07-report.md` | **AI 7** | AI 0, 8 | QA 감사 및 품질 성능 평가 보고서 |
| `docs/reports/AI-08-integration-report.md` | **AI 8** | AI 0 | 최종 릴리스 통합 및 빌드 검증 보고서 |

---

## 3. Protected Files (AI 8 Exclusive Lock)

다음 파일은 프로젝트의 글로벌 빌드 환경, 번들러, 런타임 진입점입니다.
AI 1~7은 다음 파일을 **직접 수정할 수 없습니다**. 오직 **AI 8(Final Integration Engineer)**이 통합 단계에서 최종 잠금 해제하여 편집합니다:

1. `package.json`
2. `package-lock.json`
3. `tsconfig.json` & `tsconfig.node.json`
4. `vite.config.ts`
5. `index.html`
6. `src/main.tsx`
7. `.env` 또는 루트 환경 설정 파일

> **예외 규정 (AI 0의 초기 셋업)**:  
> AI 0은 개발 조직이 시작될 수 있도록 baseline package 스펙 및 tsconfig 템플릿 제안을 아키텍처 문서(`technology-decisions.md`)에 작성하여 AI 8이 최종 통합 시 참고하도록 합니다.

