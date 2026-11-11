# MyPath365 — Shared Workspace Collision Prevention Rules

**Document Version:** 1.0.0  
**Author:** AI 0 — Chief Architect & Multi-Agent Orchestrator  
**Status:** Approved for Multi-Agent Implementation  

---

## 1. Golden Rules of the Shared Directory

모든 에이전트는 동일한 디렉터리(`C:\Users\meaip\Downloads\MyPath365`)에서 작업합니다.  
자동 파일 충돌 해결 장치가 없으므로, 모든 에이전트는 다음 6단계 **수정 전 절차(Pre-Write Protocol)**를 필수적으로 준수해야 합니다.

```
[작업 시작] ──► 1. 타겟 파일 존재 여부 및 내용 확인 (Read First)
               │
               ▼
             2. `docs/architecture/file-ownership.md` 대조
               │
               ├─► [본인 소유 아님] ──► 직접 수정 불가! RFC 작성 후 중단
               │
               ▼
             3. 보호 대상 파일 여부 확인 (package.json 등)
               │
               ├─► [보호 대상임 & AI 8 아님] ──► 수정 금지!
               │
               ▼
             4. 파일의 부분 수정(edit_file) 권장 (전체 덮어쓰기 지양)
               │
               ▼
             5. 작업 완료 후 본인 소유 보고서(docs/reports/)에 기록
```

---

## 2. The 6-Step Pre-Write Protocol

1. **읽기 우선 (Read Before Write)**:
   - 파일을 수정하거나 생성하기 전, 반드시 기존 파일의 존재 여부와 내용을 먼저 읽어 확인합니다.
2. **소유권 검증 (Verify Ownership)**:
   - 파일의 경로가 자신의 에이전트 소유권 목록에 포함되어 있는지 확인합니다.
3. **타 영역 침범 금지 (No Trespassing)**:
   - 타 AI가 소유한 파일은 오직 `import` 목적으로 읽기만 가능하며, 절대 편집할 수 없습니다.
4. **전체 교체 금지 (Avoid Full File Overwrite)**:
   - 기존 구현이 있는 파일은 불필요하게 파일 전체를 덮어쓰지 말고, 필요한 블록만 정밀 수정합니다.
5. **동시성 가정 금지 (Never Assume Concurrency Safety)**:
   - 다른 에이전트가 동시에 실행 중일 수 있으므로 충돌 가능성이 있는 파일은 격리된 전용 네임스페이스를 사용합니다.
6. **보고서 격리 (Isolated Reporting)**:
   - 모든 AI는 오직 자신에게 배정된 보고서 파일(`docs/reports/AI-XX-report.md`)에만 진행 상황과 산출물을 기록합니다.

---

## 3. Strict Prohibitions (절대 금지 행위)

1. **Notion 콘텐츠 날조 금지 (Zero Hallucination)**:
   - 원본 Notion에서 확인되지 않은 페이지 이름, 본문 내용, 카테고리를 임의로 창작하는 행위를 엄격히 금지합니다.
   - 정보가 없는 영역은 `isUnconfirmedMigration: true` 플래그 및 마이그레이션용 플레이스홀더 구조체로만 선언합니다.
2. **보호 대상 파일 무단 수정 금지**:
   - `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`, `src/main.tsx`는 AI 8 외에 누구도 수정할 수 없습니다.
3. **공유 파일 무단 삭제 금지**:
   - 타인이 작성한 파일이나 공통 아키텍처 문서를 삭제하거나 이름을 변경하는 행위를 금지합니다.
4. **미지원 블록 조용한 삭제 금지 (No Silent Dropping)**:
   - Notion 파서 또는 렌더러 구현 시 지원되지 않는 블록을 무시하거나 버리지 않고 반드시 `UnknownBlockFallback`을 통해 가시화해야 합니다.

