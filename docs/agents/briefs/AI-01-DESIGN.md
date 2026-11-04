# Agent Mission Brief — AI 1: Design System Architect

**Agent ID:** AI 1  
**Role:** Design System Architect  
**Focus:** 전체 디자인 시스템 및 공통 UI 디자인  
**Document Version:** 1.0.0  
**Supervisor:** AI 0 (Chief Architect)  

---

## 1. Role & Objectives

AI 1은 MyPath365의 시각적 언어(Visual Language)와 프레젠테이션 컴포넌트를 설계하고 구축합니다.
Apple의 미학적 정교함, Linear의 절제된 인터랙션, 프리미엄 출판물의 에디토리얼 가독성을 구현해야 합니다.

### 핵심 목표
1. CSS 변수 기반의 완전한 디자인 토큰 시스템 구축 (`src/styles/`).
2. Obsidian(#101114)과 Ivory(#F6F6F3)를 기반으로 한 라이트/다크 테마 지원.
3. 재사용 가능한 독립 원자적 UI 컴포넌트 라이브러리 제작 (`src/components/ui/`).
4. 비즈니스 로직에 결합되지 않는 순수 UI 프레젠테이션 계층 완성.

---

## 2. File Ownership & Workspace Boundaries

### AI 1 소유 영역 (Write Allowed)
- `src/styles/**` (예: `tokens.css`, `typography.css`, `reset.css`, `index.css`)
- `src/components/ui/**` (예: `Button`, `Badge`, `Modal`, `Tooltip`, `Card`, `Dropdown`, `index.ts`)
- `docs/reports/AI-01-report.md` (자체 작업 보고서)

### 수정 금지 영역 (Read-Only)
- `src/app/**`, `src/pages/**`, `src/components/content/**`, `src/types/**`, `src/features/**`
- 모든 루트 설정 파일 (`package.json`, `tsconfig.json`, `vite.config.ts` 등)

---

## 3. Interface Contracts & Specifications

AI 1은 `docs/architecture/interface-contracts.md`의 **Section 2 (Design Contract)**를 엄격히 준수하여 구현합니다:
- 토큰 정의: `src/styles/tokens.css`
- UI 컴포넌트: `src/components/ui/`에서 모든 컴포넌트를 `index.ts`로 re-export.
- 지원 컴포넌트:
  - `Button`: `variant` ('primary' | 'secondary' | 'ghost' | 'outline'), `size`, `isLoading`, `leftIcon`, `rightIcon`
  - `Badge`: 'default' | 'outline' | 'subtle'
  - `Modal`: 키보드 `Esc` 닫기 및 배경 딤 처리
  - `Tooltip`: 지연 표시 및 위치 지정
  - `Card`: 미세 테두리 및 서브픽셀 섀도우

---

## 4. Dependencies & Parallel Work Guide

- **선행 의존성**: 없음. 즉시 단독 개발 착수 가능.
- **소비자**: AI 2, 3, 5, 6
- **주의사항**: 다른 에이전트의 완료를 기다리지 말고, CSS 변수와 순수 UI 컴포넌트 작성을 완료하십시오.

---

## 5. Definition of Done (완료 기준)

1. `src/styles/tokens.css` 및 글로벌 CSS 파일 작성 완료.
2. 지정된 UI 원자적 컴포넌트 5종 이상 및 `index.ts` 배럴 파일 완성.
3. 라이트 테마 및 다크 테마 변수 매핑 완성.
4. WCAG AA 기준 명도 대비 충족.
5. `docs/reports/AI-01-report.md`에 산출물 목록, CSS 토큰 가이드, 사용 예시 기록 완료.
