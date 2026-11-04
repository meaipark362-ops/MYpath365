# MyPath365 — Integration Strategy & AI 8 Protocol

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Mission of AI 8 (Final Integration Engineer)

AI 8은 **전체 AI 1~7의 개발 작업이 모두 종료되고 개별 보고서(`docs/reports/AI-01-report.md` ~ `docs/reports/AI-07-report.md`)가 제출된 이후에만 실행**됩니다.  
AI 8의 임무는 각 AI가 개별 영역에서 완성한 모듈들을 유기적으로 결합하여 최종 실행 가능한 단일 웹 애플리케이션으로 완성하는 것입니다.

---

## 2. Integration Workflow

```
[AI 1~7 보고서 제출 완료 확인]
             │
             ▼
[Step 1: 환경 구성 및 잠금 해제 (Unlock Protected Files)]
├── package.json 의존성 최종 정의 및 npm install
├── vite.config.ts 및 tsconfig.json 설정 확정
└── index.html 기본 메타태그 및 폰트 링크 구성
             │
             ▼
[Step 2: 애플리케이션 엔트리포인트 연결 (src/main.tsx & src/app/App.tsx)]
├── 디자인 시스템 글로벌 스타일 import (src/styles/index.css)
├── 라우터 및 상태 프로바이더 마운트
└── 최상위 레이아웃(AppLayout) 연결
             │
             ▼
[Step 3: 모듈 바인딩 및 타입 체크]
├── npx tsc --noEmit (TypeScript 전체 컴파일 검증)
└── import 경로 오류 및 누락된 export 해결
             │
             ▼
[Step 4: 빌드 및 프로덕션 번들 검증]
├── npm run build (Vite 프로덕션 번들링)
└── dist/ 디렉터리 생성 및 번들 사이즈 검증
             │
             ▼
[Step 5: 최종 통합 보고서 작성]
└── docs/reports/AI-08-integration-report.md
```

---

## 3. Protected Files Unlock Checklist (AI 8 Only)

AI 8은 작업 시작 시 다음 파일들을 공식적으로 활성화합니다:

1. **`package.json`**:
   - React 18 / 19, TypeScript, Vite, React Router, Zustand, Lucide React, Zod, Motion 등 최종 확정 패키지 등록.
2. **`tsconfig.json` & `tsconfig.node.json`**:
   - `paths` alias (`@/*` -> `./src/*`) 구성 및 엄격한 타입 체크(`strict: true`) 적용.
3. **`vite.config.ts`**:
   - React 플러그인, 경로 별칭(resolve alias), 포트 설정.
4. **`index.html`**:
   - 뷰포트 메타 태그, Google Fonts(Inter, Newsreader, JetBrains Mono) 링크, 타이틀 'MyPath365'.
5. **`src/main.tsx`**:
   - React `createRoot`, `StrictMode`, `index.css` 로드 및 `<App />` 렌더링.

---

## 4. Conflict Resolution & Fallback Policy

만약 AI 1~7 간의 인터페이스 불일치나 타입 오류가 발견될 경우:
1. AI 8은 기존 기능을 임의로 삭제하지 않고 최소한의 어댑터(Adapter) 패턴을 적용하여 결합합니다.
2. 원본 Notion 미확인 데이터로 인한 런타임 오류 방지를 위해 항상 `UnknownBlockFallback`이 발동하도록 안전장치를 둡니다.
3. 통합 작업 중 수정한 모든 사항은 `docs/reports/AI-08-integration-report.md`에 명확한 사유와 함께 기록합니다.
