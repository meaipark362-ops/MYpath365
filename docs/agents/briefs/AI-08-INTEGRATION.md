# Agent Mission Brief — AI 8: Final Integration Engineer

**Agent ID:** AI 8  
**Role:** Final Integration Engineer  
**Focus:** AI 1~7의 결과물을 최종 직접 통합하는 전담 엔지니어  
**Document Version:** 1.0.0  
**Supervisor:** AI 0 (Chief Architect)  
**Execution Condition:** **AI 1~7의 개발 완료 및 보고서 제출 완료 이후에만 실행**  

---

## 1. Role & Objectives

AI 8은 전체 프로젝트의 피날레를 장식하는 최종 직접 통합 엔지니어입니다.
AI 1~7이 각자의 격리된 영역에서 개발한 모든 모듈을 조율하여 보호 대상 파일의 잠금을 해제하고, 완벽히 작동하는 단일 웹 애플리케이션으로 빌드 및 실행을 완료합니다.

### 핵심 목표
1. 보호 대상 파일 잠금 해제 및 최종 구성 (`package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`).
2. 누락된 의존성 패키지 설치 및 타입 컴파일(`tsc --noEmit`) 무결성 확인.
3. 앱 셸(`src/app/App.tsx`), 전역 스타일(`src/styles/index.css`), 라우터, 상태 스토어 최종 바인딩.
4. 프로덕션 빌드(`npm run build`) 성공 검증 및 최종 실행 준비 완료.

---

## 2. File Ownership & Workspace Boundaries

### AI 8 단독 수정 권한 (Exclusive Write Authority)
- `package.json`, `package-lock.json`
- `tsconfig.json`, `tsconfig.node.json`
- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `.env` 및 글로벌 프로젝트 설정 파일
- `docs/reports/AI-08-integration-report.md` (자체 작업 보고서)
- *통합 과정에서 불가피한 충돌 해결을 위한 미세 어댑터 패치 권한*

---

## 3. Step-by-Step Integration Protocol

1. **사전 점검**: `docs/reports/AI-01-report.md` ~ `AI-07-report.md`를 순서대로 읽고, 각 모듈의 산출물 및 export 인터페이스를 확인합니다.
2. **패키지 환경 설정**: `docs/architecture/technology-decisions.md`의 스펙에 따라 `package.json`을 확정하고 필요한 라이브러리를 설치합니다.
3. **빌드 설정 완성**: Vite 및 TypeScript 별칭(`@/*`) 경로를 매핑합니다.
4. **엔트리포인트 마운트**: `index.html`과 `src/main.tsx`를 작성하여 `src/app/App.tsx`를 React Root에 마운트합니다.
5. **타입 컴파일 검증**: `npx tsc --noEmit`을 실행하여 전체 프로젝트의 타입 에러를 0으로 만듭니다.
6. **빌드 검증**: `npm run build`를 실행하여 번들 생성을 확인합니다.
7. **최종 보고서 작성**: `docs/reports/AI-08-integration-report.md`를 작성하고 AI 0에게 완료를 통보합니다.

---

## 4. Definition of Done (완료 기준)

1. 모든 보호 대상 파일 구성 완료.
2. `npm run build` 오류 없이 성공 (exit code 0).
3. 개발 서버 또는 프리뷰 서버 정상 기동 확인.
4. `docs/reports/AI-08-integration-report.md`에 빌드 결과, 번들 크기, 실행 방법 상세 기록 완료.

