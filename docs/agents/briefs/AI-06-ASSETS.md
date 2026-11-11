# Agent Mission Brief — AI 6: Asset & Media Engineer

**Agent ID:** AI 6  
**Role:** Asset & Media Engineer  
**Focus:** 이미지, 폰트, 미디어, 에셋 로딩 및 최적화  
**Document Version:** 1.0.0  
**Supervisor:** AI 0 (Chief Architect)  

---

## 1. Role & Objectives

AI 6은 MyPath365의 모든 정적 자산(Static Assets)과 미디어 로딩 파이프라인을 책임집니다.
이미지 로딩 실패 시 레이아웃 깨짐을 방지하고, 에셋 최적화 및 Apple 스타일의 세련된 플레이스홀더를 제공합니다.

### 핵심 목표
1. 에셋 로딩 및 최적화 서비스 구축 (`src/services/assets/`).
2. 에러 안전형 이미지 래퍼 및 스켈레톤 로더 제공.
3. SVG 아이콘 및 폰트 디렉터리 체계 구축 (`public/assets/`).
4. 오프라인 또는 누락된 Notion 이미지에 대한 우아한 폴백(Fallback Placeholder) 메커니즘 수립.

---

## 2. File Ownership & Workspace Boundaries

### AI 6 소유 영역 (Write Allowed)
- `public/assets/**` (`fonts/`, `icons/`, `images/`, `placeholders/`)
- `src/services/assets/**` (`assetLoader.ts`, `mediaOptimizer.ts`, `index.ts`)
- `docs/reports/AI-06-report.md` (자체 작업 보고서)

### 수정 금지 영역 (Read-Only)
- `src/components/content/**`, `src/styles/**`, `src/types/**`
- 모든 루트 설정 파일 (`package.json`, `tsconfig.json` 등)

---

## 3. Interface Contracts & Specifications

AI 6은 `docs/architecture/interface-contracts.md`의 **Section 6 (Asset Contract)**를 구현합니다:
- 서비스 인터페이스: `IAssetLoader`
  - `resolveAssetUrl(path: string): string`
  - `getPlaceholderForType(type: 'cover' | 'avatar' | 'inline'): string`
- 컴포넌트 Props 인터페이스: `OptimizedImageProps`
- 안전장치: 외부 이미지 URL이 깨지거나 로딩 실패 시 인라인 SVG 데이터 URI 플레이스홀더로 즉시 대체.

---

## 4. Dependencies & Parallel Work Guide

- **선행 의존성**: 없음. 즉시 단독 개발 착수.
- **제공 대상**: AI 2 (Frontend) 및 AI 3 (Content)에게 이미지 로더 및 에셋 헬퍼 제공.

---

## 5. Definition of Done (완료 기준)

1. `src/services/assets/assetLoader.ts` 로더 서비스 완성.
2. `public/assets/placeholders/`에 커버 및 인라인용 세련된 SVG 플레이스홀더 배치.
3. 이미지 에러 감지 및 자동 폴백 메커니즘 완성.
4. `docs/reports/AI-06-report.md`에 에셋 구조, 폴백 이미지 명세, 사용 방법 기록 완료.

