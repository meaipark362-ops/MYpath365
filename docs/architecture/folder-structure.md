# MyPath365 — Folder Structure Specification

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Directory Tree Overview

```
MyPath365/
├── .gitignore
├── README.md                                    # [AI 0] 시스템 안내 및 가이드
├── package.json                                 # [PROTECTED - AI 8 ONLY]
├── package-lock.json                            # [PROTECTED - AI 8 ONLY]
├── tsconfig.json                                # [PROTECTED - AI 8 ONLY]
├── tsconfig.node.json                           # [PROTECTED - AI 8 ONLY]
├── vite.config.ts                               # [PROTECTED - AI 8 ONLY]
├── index.html                                   # [PROTECTED - AI 8 ONLY]
│
├── docs/
│   ├── architecture/                            # [AI 0] 전체 시스템 아키텍처 및 공통 규격
│   │   ├── system-architecture.md
│   │   ├── folder-structure.md
│   │   ├── file-ownership.md
│   │   ├── interface-contracts.md
│   │   ├── dependency-map.md
│   │   ├── shared-workspace-rules.md
│   │   ├── integration-strategy.md
│   │   ├── quality-standards.md
│   │   └── technology-decisions.md
│   ├── agents/
│   │   └── briefs/                              # [AI 0] AI 1~8 전용 상세 업무 브리프
│   │       ├── AI-01-DESIGN.md
│   │       ├── AI-02-FRONTEND.md
│   │       ├── AI-03-CONTENT.md
│   │       ├── AI-04-DATA.md
│   │       ├── AI-05-INTERACTION.md
│   │       ├── AI-06-ASSETS.md
│   │       ├── AI-07-QA.md
│   │       └── AI-08-INTEGRATION.md
│   └── reports/                                 # [각 AI 전용 보고서 저장소]
│       ├── AI-0-architecture-report.md          # [AI 0]
│       ├── AI-01-report.md                      # [AI 1]
│       ├── AI-02-report.md                      # [AI 2]
│       ├── AI-03-report.md                      # [AI 3]
│       ├── AI-04-report.md                      # [AI 4]
│       ├── AI-05-report.md                      # [AI 5]
│       ├── AI-06-report.md                      # [AI 6]
│       ├── AI-07-report.md                      # [AI 7]
│       └── AI-08-integration-report.md         # [AI 8]
│
├── public/
│   └── assets/                                  # [AI 6] 정적 미디어, 폰트, 아이콘
│       ├── fonts/
│       ├── icons/
│       ├── images/
│       └── placeholders/
│
├── src/
│   ├── main.tsx                                 # [PROTECTED - AI 8 ONLY]
│   │
│   ├── styles/                                  # [AI 1] 글로벌 스타일 & 토큰
│   │   ├── tokens.css
│   │   ├── typography.css
│   │   ├── reset.css
│   │   └── index.css
│   │
│   ├── components/
│   │   ├── ui/                                  # [AI 1] 원자적 프리젠테이션 컴포넌트
│   │   │   ├── Button/
│   │   │   ├── Badge/
│   │   │   ├── Modal/
│   │   │   ├── Tooltip/
│   │   │   ├── Card/
│   │   │   ├── Dropdown/
│   │   │   └── index.ts
│   │   ├── layout/                              # [AI 2] 레이아웃 컴포넌트
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Breadcrumb.tsx
│   │   │   ├── TableOfContents.tsx
│   │   │   └── index.ts
│   │   └── content/                             # [AI 3] 콘텐츠 렌더링 블록 엔진
│   │       ├── ContentRenderer.tsx
│   │       ├── BlockDispatcher.tsx
│   │       ├── blocks/
│   │       │   ├── ParagraphBlock.tsx
│   │       │   ├── HeadingBlock.tsx
│   │       │   ├── ListBlock.tsx
│   │       │   ├── TodoBlock.tsx
│   │       │   ├── ToggleBlock.tsx
│   │       │   ├── CalloutBlock.tsx
│   │       │   ├── QuoteBlock.tsx
│   │       │   ├── DividerBlock.tsx
│   │       │   ├── TableBlock.tsx
│   │       │   ├── CodeBlock.tsx
│   │       │   ├── ImageBlock.tsx
│   │       │   ├── VideoBlock.tsx
│   │       │   ├── BookmarkBlock.tsx
│   │       │   ├── ChildPageBlock.tsx
│   │       │   └── UnknownBlock.tsx
│   │       └── index.ts
│   │
│   ├── app/                                     # [AI 2] 앱 설정 및 라우터 설정
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   └── providers.tsx
│   │
│   ├── pages/                                   # [AI 2] 라우트 페이지 컴포넌트
│   │   ├── HomePage.tsx
│   │   ├── ContentPage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── FavoritesPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── types/                                   # [AI 4] 도메인 타입 및 계약 정의
│   │   ├── schema.ts                            # Zod & TS 스키마
│   │   ├── page.ts                              # Page 엔티티
│   │   ├── block.ts                             # ContentBlock 엔티티
│   │   ├── contracts.ts                         # 공통 인터페이스 계약
│   │   └── index.ts
│   │
│   ├── data/                                    # [AI 4] 정적 데이터 및 검증기
│   │   ├── registry.json                        # 페이지 인덱스 레지스트리
│   │   ├── pages/                               # 정규화된 페이지 JSON 파일들
│   │   └── schema-validator.ts
│   │
│   ├── services/
│   │   ├── content/                             # [AI 4] 데이터 조회 및 파싱 서비스
│   │   │   ├── contentService.ts
│   │   │   ├── pageQuery.ts
│   │   │   └── index.ts
│   │   └── assets/                              # [AI 6] 에셋 최적화 및 로더 서비스
│   │       ├── assetLoader.ts
│   │       ├── mediaOptimizer.ts
│   │       └── index.ts
│   │
│   ├── features/                                # [AI 5] 인터랙션 기능 단위
│   │   ├── search/                              # 검색 기능 (클라이언트 인덱싱)
│   │   │   ├── SearchModal.tsx
│   │   │   ├── searchEngine.ts
│   │   │   └── useSearch.ts
│   │   ├── favorites/                           # 북마크/즐겨찾기
│   │   │   ├── FavoriteButton.tsx
│   │   │   └── useFavorites.ts
│   │   └── progress/                            # 읽기 진행률
│   │       ├── ProgressBar.tsx
│   │       └── useReadingProgress.ts
│   │
│   ├── stores/                                  # [AI 5] Zustand 글로벌 상태
│   │   ├── userStore.ts                         # 즐겨찾기, 읽기 기록, 환경설정
│   │   └── uiStore.ts                           # 사이드바 열림, 검색 모달 상태
│   │
│   └── hooks/                                   # [AI 5] 공통 인터랙션 훅
│       ├── useLocalStorage.ts
│       ├── useScrollPosition.ts
│       └── useKeyboardShortcut.ts
│
├── tests/                                       # [AI 7] 단위 및 통합 테스트
│   ├── unit/
│   │   ├── content-engine.test.ts
│   │   ├── data-schema.test.ts
│   │   └── user-store.test.ts
│   ├── visual/
│   └── a11y/
│
└── scripts/
    └── qa/                                      # [AI 7] QA, 린트 및 성능 검증 스크립트
        ├── audit-accessibility.ts
        ├── validate-schemas.ts
        └── bundle-size-check.ts
```
