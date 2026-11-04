# MyPath365

> **Independent, Editorial-Grade Knowledge Web Application**  
> Re-architected from Notion with Apple-style visual sophistication and Linear-level interaction polish.

---

## 1. Project Overview

**MyPath365**는 기존 Notion에 구성된 계층적 지식 구조와 콘텐츠를 보존하면서, Notion의 성능 제약 및 서식 제한에서 벗어난 독립적이고 현대적인 웹 애플리케이션으로 재구축하는 프로젝트입니다.

### 4대 디자인 & 엔지니어링 철학
1. **Premium Minimal**: 절제된 여백과 군더더기 없는 레이아웃 미학.
2. **Apple Visual Sophistication**: 옵시디언(#101114)과 아이보리(#F6F6F3)를 기조로 한 정교한 다크/라이트 테마, 서브픽셀 보더.
3. **Linear Interaction Polish**: 즉각적인 반응성, 유려한 스프링 애니메이션, `Cmd+K` 단축키 검색.
4. **Editorial Content Readability**: 680~740px 본문 컬럼, 1.7배 행간, 정밀한 활자 위계.

---

## 2. Multi-Agent Development Organization

본 프로젝트는 단일 공유 디렉터리 내에서 9개의 특화된 AI 에이전트가 협업하여 구축합니다:

| 에이전트 | 직책 | 핵심 역할 | 전용 소유 디렉터리 |
|---|---|---|---|
| **AI 0** | **Chief Architect** | 전체 아키텍처, 계약 인터페이스, 충돌 방지 거버넌스 | `README.md`, `docs/architecture/`, `docs/agents/briefs/` |
| **AI 1** | **Design System Architect** | CSS 디자인 토큰, 테마 변수, 원자적 UI 컴포넌트 | `src/styles/`, `src/components/ui/` |
| **AI 2** | **Frontend Architect** | 앱 셸, 라우팅, 반응형 레이아웃, 페이지 뷰 | `src/app/`, `src/pages/`, `src/components/layout/` |
| **AI 3** | **Content Engine Engineer** | Notion AST 블록 렌더러, 16개 표준 블록, 폴백 | `src/components/content/` |
| **AI 4** | **Data Architect** | 데이터 모델, TypeScript 타입, Zod 검증, 쿼리 서비스 | `src/types/`, `src/data/`, `src/services/content/` |
| **AI 5** | **Interaction Engineer** | 검색 엔진, 즐겨찾기, 읽기 진행률, Zustand 스토어 | `src/features/`, `src/stores/`, `src/hooks/` |
| **AI 6** | **Asset & Media Engineer** | 미디어 최적화 로더, 폴백 플레이스홀더, 폰트/아이콘 | `public/assets/`, `src/services/assets/` |
| **AI 7** | **QA & Performance Engineer** | 단위 테스트, 스키마 검증, 접근성(a11y) 및 성능 감사 | `tests/`, `scripts/qa/` |
| **AI 8** | **Final Integration Engineer** | 보호 대상 파일 잠금 해제, 최종 번들 빌드 및 릴리스 검증 | `package.json`, `vite.config.ts`, `src/main.tsx` 등 |

---

## 3. Directory Structure

```
MyPath365/
├── README.md                                    # [AI 0] 시스템 안내
├── docs/
│   ├── architecture/                            # [AI 0] 기술 및 아키텍처 규격
│   │   ├── system-architecture.md
│   │   ├── folder-structure.md
│   │   ├── file-ownership.md
│   │   ├── interface-contracts.md
│   │   ├── dependency-map.md
│   │   ├── shared-workspace-rules.md
│   │   ├── integration-strategy.md
│   │   ├── quality-standards.md
│   │   └── technology-decisions.md
│   ├── agents/briefs/                           # [AI 0] AI 1~8 전용 미션 브리프
│   └── reports/                                 # [AI 0~8] 에이전트별 개별 산출 보고서
├── public/assets/                               # [AI 6] 정적 미디어 및 플레이스홀더
└── src/
    ├── styles/                                  # [AI 1] CSS 토큰 및 전역 스타일
    ├── components/
    │   ├── ui/                                  # [AI 1] 원자적 UI 컴포넌트
    │   ├── layout/                              # [AI 2] 레이아웃 컴포넌트
    │   └── content/                             # [AI 3] Notion 블록 렌더러
    ├── app/                                     # [AI 2] 앱 설정 및 라우터
    ├── pages/                                   # [AI 2] 라우트 페이지
    ├── types/                                   # [AI 4] 도메인 타입 및 계약 인터페이스
    ├── data/                                    # [AI 4] 정적 데이터 및 검증기
    ├── services/
    │   ├── content/                             # [AI 4] 콘텐츠 쿼리 서비스
    │   └── assets/                              # [AI 6] 에셋 최적화 서비스
    ├── features/                                # [AI 5] 검색, 즐겨찾기, 진척도 기능
    ├── stores/                                  # [AI 5] Zustand 글로벌 상태
    └── hooks/                                   # [AI 5] 인터랙션 훅
```

---

## 4. Protected Files Governance

다음 파일은 **AI 8(Final Integration Engineer)** 전용 잠금 파일입니다. AI 1~7은 다음 파일을 절대 직접 수정할 수 없습니다:
- `package.json` & `package-lock.json`
- `tsconfig.json` & `tsconfig.node.json`
- `vite.config.ts`
- `index.html`
- `src/main.tsx`

---

## 5. Collision Prevention Rules

1. **읽기 우선 (Read First)**: 파일 작성 전 대상 파일 내용을 먼저 읽습니다.
2. **소유권 준수 (Respect Ownership)**: 본인 소유 디렉터리 외부의 파일은 직접 편집하지 않고, 필요 시 보고서의 RFC 항목을 통해 요청합니다.
3. **독립 보고서 작성**: 진행 상황과 산출물은 자신에게 배정된 `docs/reports/AI-XX-report.md`에만 작성합니다.
4. **Zero-Hallucination Policy**: 원본 Notion에서 확인되지 않은 페이지나 콘텐츠를 임의로 지어내지 않습니다.

---

## 6. Execution Lifecycle

1. **PHASE 0~3 (완료)**: AI 0 아키텍처 설계, 계약 제정, 디렉터리 및 브리프 준비 완료.
2. **PHASE 4 (현재 대기)**: 사용자가 각 AI 프롬프트 투입을 통해 **AI 1~7 동시 병렬 개발 시작**.
3. **PHASE 5**: AI 1~7의 개별 보고서(`docs/reports/AI-01-report.md` ~ `AI-07-report.md`) 완료 확인.
4. **PHASE 6**: AI 8을 실행하여 보호 대상 파일 활성화 및 전체 직접 통합 진행.
5. **PHASE 7**: 통합 빌드 및 QA 최종 서명 후 릴리스 완료.
