# MyPath365 — Technology Decisions & Baseline Specification

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Environment & Stack Rationale

### 1.1 Host Environment Discovery
- **OS**: Windows 11
- **Node.js**: v26.13.0
- **npm**: 11.20.0
- **Version Control**: Git 2.55.0
- **Workspace State**: Fresh Empty Directory (`C:\Users\meaip\Downloads\MyPath365`)

### 1.2 Technology Selection

| 영역 | 선정 기술 | 선정 이유 및 가치 |
|---|---|---|
| **Core Framework** | **React 18 / 19 + TypeScript** | 안정적인 컴포넌트 생태계 및 엄격한 타입 안정성 확보 |
| **Build Tool** | **Vite** | 초고속 HMR 및 최적화된 ESM 기반 프로덕션 번들링 |
| **Styling** | **Modern CSS (Custom Properties) & CSS Modules** | 외부 빌드 의존성 및 PostCSS 설정 복잡도를 최소화하고, Apple/Linear 특유의 정교한 미세 픽셀 제어 및 다크모드 토큰 완벽 지원 |
| **State Management**| **Zustand** | 가벼운 번들 사이즈(< 1KB), 보일러플레이트 없는 단순성, LocalStorage 동기화 우수 |
| **Routing** | **React Router DOM v6** | 견고한 브라우저 히스토리 관리, 중첩 라우트 지원 |
| **Schema Validation**| **Zod** | Notion JSON 블록 데이터의 런타임 타입 무결성 검증 |
| **Animation** | **Motion (Framer Motion)** | Apple/Linear 수준의 부드러운 스프링 인터랙션 및 제스처 지원 |
| **Iconography** | **Lucide React** | Linear 스타일의 1.5px/2px 스트로크 정밀 아이콘 세트 |
| **Storage** | **Static JSON + LocalStorage** | Notion 콘텐츠의 불변 정적 배포 및 클라이언트 사용자 상태(즐겨찾기, 진척도) 분리 |
| **Future Backend** | **Supabase (Ready)** | 향후 인증 및 클라우드 동기화 확장을 고려한 인터페이스 설계 |

---

## 2. Baseline Configuration Specification (For AI 8 Final Unlock)

AI 8이 최종 통합 시 생성/활성화할 표준 `package.json` 참조 스펙입니다:

```json
{
  "name": "mypath365",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "qa:audit": "ts-node scripts/qa/audit-accessibility.ts"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "zustand": "^4.5.5",
    "lucide-react": "^0.439.0",
    "zod": "^3.23.8",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^22.5.4",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.4",
    "vite": "^5.4.3"
  }
}
```

---

## 3. Notion Content Migration & Isolation Principle

- 원본 Notion 파일이 아직 프로젝트에 투입되지 않았으므로, 시스템은 **'Zero-Hallucination Migration Framework'**를 채택합니다.
- AI 4는 스키마 명세에 부합하는 `schema-validator.ts`와 함께 마이그레이션 예시 템플릿(Page 1개: "MyPath365 Introduction [Unconfirmed Migration Structure]")만을 정적 파일로 생성하며, 추가적인 미확인 페이지는 일체 생성하지 않습니다.
- 사용자가 실제 Notion HTML/Markdown/JSON Export 파일을 추가할 때 즉시 자동 마이그레이션 가능한 어댑터 파이프라인 구조를 선제적으로 설계합니다.

