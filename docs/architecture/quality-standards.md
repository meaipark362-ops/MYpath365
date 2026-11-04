# MyPath365 — Quality Standards & Performance Benchmarks

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Visual & Editorial Polish Standards

### 1.1 Editorial Typography Guidelines
- **Body Column Width**: 680px ~ 740px (최대 가독성 컬럼).
- **Line Height**: `1.65` ~ `1.75` (긴 글 읽기에 최적화된 편안한 줄간격).
- **Paragraph Spacing**: `1.2em` ~ `1.5em` (블록 간 구분이 명확한 여백).
- **Hierarchy**:
  - H1: 32px ~ 40px (굵기 600~700, 자간 -0.02em)
  - H2: 24px ~ 28px (굵기 600, 자간 -0.015em)
  - H3: 18px ~ 20px (굵기 600, 자간 -0.01em)
  - Body: 16px (굵기 400, 자간 0)
  - Caption / Meta: 13px ~ 14px (색상: Slate / Silver)

### 1.2 Responsive Breakpoints
- **Mobile**: `< 640px` (단일 컬럼, 오프캔버스 드로어 사이드바)
- **Tablet**: `640px ~ 1024px` (접이식 사이드바, 유동적 본문)
- **Desktop**: `> 1024px` (고정 2/3 컬럼: 사이드바 - 메인 본문 - TOC)

---

## 2. Accessibility (a11y) Standards (WCAG 2.1 AA)

1. **명도 대비 (Contrast Ratio)**:
   - 본문 텍스트: 최소 4.5:1 이상
   - 대형 텍스트 및 UI 컴포넌트 경계: 최소 3:1 이상
2. **키보드 접근성 (Keyboard Navigability)**:
   - 검색 단축키 (`Cmd+K` / `Ctrl+K`), 모달 `Escape` 닫기 지원.
   - 모든 대화형 요소(버튼, 링크, 토글)는 명확한 `:focus-visible` 아웃라인 제공.
3. **스크린 리더 지원**:
   - 의미론적 HTML 태그 사용 (`<nav>`, `<main>`, `<article>`, `<aside>`, `<header>`).
   - SVG 아이콘에 `aria-hidden="true"` 및 버튼에 `aria-label` 부여.

---

## 3. Performance & Core Web Vitals Targets

1. **Initial Bundle Size**: Gzip 압축 기준 초기 JS 번들 < 150KB.
2. **LCP (Largest Contentful Paint)**: < 1.8초.
3. **FID / INP (Interaction to Next Paint)**: < 100ms.
4. **CLS (Cumulative Layout Shift)**: < 0.05 (이미지 및 스켈레톤 고정 비율 지정).

---

## 4. Error Handling & Fallback Standards

1. **React Error Boundary**:
   - 블록 단위 및 페이지 단위 Error Boundary를 배치하여 하나의 불량 블록이 전체 페이지 렌더링을 중단시키지 않도록 격리.
2. **Unknown Block Fallback**:
   - 미확인 또는 미지원 Notion 블록 발생 시 사용자에게 친절한 인라인 안내 배너(`UnknownBlock`)를 렌더링하고 원본 raw 데이터를 안전하게 보존.
