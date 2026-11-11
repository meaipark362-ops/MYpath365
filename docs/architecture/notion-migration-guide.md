# Notion Content Migration & Import Architecture Specification

**Version:** 1.0.0  
**Author:** AI 4 (Data Architect)  
**Status:** Approved Architecture

---

## 1. Executive Summary & Zero-Hallucination Status

- **현재 리포지토리 상태**: Notion Export 파일(Markdown, CSV, JSON 또는 Zip 파일)이 작업 디렉터리에 존재하지 않습니다.
- **Zero-Hallucination 준수**: 임의로 가짜 비즈니스 콘텐츠를 날조하여 생성하지 않았으며, AST 스키마와 렌더러 파이프라인의 종단 간 검증을 위한 **단 1개의 표준 마이그레이션 템플릿 페이지 (`welcome-unconfirmed-migration.json`)**만을 제공합니다.
- 본 문서는 향후 실제 Notion Export 파일이 유입되었을 때, 무손실(Zero-loss)로 정규화된 `PageItem` 및 `ContentBlock`으로 변환할 수 있는 표준화된 Import 파이프라인을 규정합니다.

---

## 2. Notion Export Format Analysis

Notion의 공식 내보내기 방식은 크게 **HTML**, **Markdown & CSV**, 그리고 **Notion API JSON** 형태를 가집니다.

### 2.1 Directory Hierarchy Mapping
Notion의 중첩 페이지 구조는 파일 시스템에서 폴더와 파일의 관계로 표현됩니다:
- `Page Title <UUID>.md` (상위 페이지)
- `Page Title <UUID>/` (하위 페이지들이 포함된 디렉터리)
- `Page Title <UUID>/Attachment.png` (첨부 이미지 및 파일)

### 2.2 ID & Slug Resolution Strategy
1. **UUID 추출**: Notion 파일명 말미의 32자리 hex ID를 고유 식별자(`pageId`)로 정규화합니다.
2. **Slug 생성**: 한글/영문 제목을 기반으로 URL-friendly slug를 자동 생성하고 충돌 시 UUID short-hash를 접미사로 부여합니다.
3. **Hierarchy 재구성**: 상위 디렉터리 경로를 파싱하여 부모 페이지 ID(`parentId`)를 연결하고, 자식 ID 배열(`childPageIds`)을 레지스트리에 집계합니다.

---

## 3. Block Mapping Specification

| Notion Block Type | MyPath365 AST Type | Target Component (AI 3) | Processing Logic & Fallback |
|---|---|---|---|
| Paragraph | `paragraph` | `<ParagraphBlock />` | RichTextSpan 배열로 포맷팅 분해 (bold, italic, code, href 등) |
| Heading 1, 2, 3 | `heading_1`, `2`, `3` | `<HeadingBlock />` | 제목 텍스트 및 TOC 연동 ID 추출 |
| Bulleted List Item | `bulleted_list_item` | `<ListItemBlock />` | 목록 중첩 및 RichText 파싱 |
| Numbered List Item | `numbered_list_item` | `<ListItemBlock />` | 순서 있는 목록 파싱 |
| To-do Checkbox | `to_do` | `<TodoBlock />` | 체크 여부(`checked: boolean`) 파싱. (동적 상태는 AI 5 UserStore와 동기화) |
| Toggle List | `toggle` | `<ToggleBlock />` | 토글 헤더 텍스트 및 하위 children 블록 재귀 파싱 |
| Callout | `callout` | `<CalloutBlock />` | 아이콘(이모지/SVG) 및 본문 텍스트 분리 |
| Quote | `quote` | `<QuoteBlock />` | 인용구 텍스트 파싱 |
| Divider | `divider` | `<DividerBlock />` | 구분선 태그 생성 |
| Table / Row | `table`, `table_row` | `<TableBlock />` | 열/행 헤더 여부, 2차원 셀 배열(`cells: RichTextSpan[][]`) 구조화 |
| Code Block | `code` | `<CodeBlock />` | 프로그래밍 언어(`language`) 및 코드 텍스트 보존 |
| Image / Media | `image`, `video` | `<ImageBlock />` | AI 6 에셋 로더 호환 경로(`/assets/...`)로 재매핑 |
| Bookmark / Link | `bookmark` | `<BookmarkBlock />` | 외부 URL, 미리보기 메타데이터 보존 |
| Child Page | `child_page` | `<ChildPageBlock />` | 내부 서브페이지 링크 컴포넌트로 변환 |
| Unrecognized Type | `unknown` | `<UnknownBlock />` | 원본 속성(`rawData`)을 완전 보존하며 마이그레이션 안내 배너 표시 |

---

## 4. Import Automation CLI Pipeline (Roadmap)

사용자가 Notion 내보내기 파일을 프로젝트 루트 또는 `data/notion-export/`에 배치했을 때 실행할 자동화 스크립트 규격입니다:

```bash
# 향후 실행 커맨드 (스크립트 예시)
node scripts/import-notion.js --source=./notion-export --out=src/data/pages
```

### 처리 파이프라인 단계:
1. **스캔 & 검사**: 내보내기 압축 해제 및 파일 트리 스캔.
2. **미디어 자산 추출**: 본문에 삽입된 이미지를 `public/assets/images/`로 복사하고 상대 경로를 URL로 재작성.
3. **AST 변환**: `NotionImportAdapter.adaptPage()` 및 `adaptBlock()`을 통해 정규화된 `PageItem` JSON 생성.
4. **매니페스트 빌드**: 모든 변환 페이지를 수집하여 `src/data/registry.json` 및 `src/data/manifest.json` 자동 갱신.
5. **무결성 검증**: `schema-validator.ts`의 `validateManifestHierarchy`를 실행하여 중복 ID, 누락된 부모, 순환 참조 유무를 0 오류로 확인.
