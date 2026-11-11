# MyPath365 Design System Guide

MyPath365의 시각적 언어 및 UI 컴포넌트 라이브러리 가이드입니다. Apple의 시각적 정교함, Linear의 절제된 반응성, 그리고 긴 에디토리얼 글을 읽기 편한 Premium Minimal 디자인 원칙을 구현합니다.

---

## 1. Design Tokens (`src/styles/`)

모든 토큰은 CSS 변수(`var(--token-name)`)로 정의되어 있으며 `src/styles/tokens.css` 및 `src/styles/typography.css`에 선언되어 있습니다.

### 1.1 Core Color Tokens
- `--color-obsidian`: `#101114` (기본 텍스트 및 다크 모드 배경)
- `--color-ivory`: `#F6F6F3` (라이트 모드 배경 및 페이퍼 톤)
- `--color-silver`: `#A7A9AD` (보조 텍스트 및 메탈릭 경계)
- `--color-slate`: `#747B85` (뮤트 텍스트 및 서브 레이블)

### 1.2 Semantic Theme Tokens
라이트 테마가 기본값이며, `data-theme="dark"` 속성을 `html` 또는 부모 컨테이너에 지정하여 다크 모드로 전환할 수 있습니다.

| 역할 | Light Theme | Dark Theme (`[data-theme="dark"]`) |
|---|---|---|
| `--bg-primary` | `#FFFFFF` | `#101114` |
| `--bg-secondary` | `#F6F6F3` | `#18191D` |
| `--bg-surface` | `#FBFBFA` | `#1E2025` |
| `--bg-elevated` | `#FFFFFF` | `#262930` |
| `--text-primary` | `#101114` | `#F6F6F3` |
| `--text-secondary` | `#575D66` | `#A7A9AD` |
| `--text-muted` | `#8E9299` | `#747B85` |
| `--border-subtle` | `rgba(16, 17, 20, 0.08)` | `rgba(246, 246, 243, 0.08)` |
| `--border-medium` | `rgba(16, 17, 20, 0.14)` | `rgba(246, 246, 243, 0.15)` |
| `--border-strong` | `rgba(16, 17, 20, 0.24)` | `rgba(246, 246, 243, 0.28)` |
| `--accent-primary`| `#101114` | `#F6F6F3` |
| `--accent-contrast`| `#FFFFFF` | `#101114` |
| `--focus-ring` | `rgba(16, 17, 20, 0.85)` | `rgba(246, 246, 243, 0.85)` |

### 1.3 Typography Scale
한국어(Pretendard)와 영어(Inter) 서체를 조화롭게 매핑하며 가독성을 최우선으로 합니다.

- **Display**: 40px (`--text-4xl`), Bold, Line-height 1.2 (`.text-display`)
- **Heading 1**: 32px (`--text-3xl`), Bold, Line-height 1.2 (`.text-h1`)
- **Heading 2**: 24px (`--text-2xl`), Semibold, Line-height 1.35 (`.text-h2`)
- **Heading 3**: 20px (`--text-xl`), Semibold, Line-height 1.35 (`.text-h3`)
- **Body**: 16px (`--text-base`), Regular, Line-height 1.72 (`.text-body`)
- **Body Small**: 14px (`--text-sm`), Regular, Line-height 1.5 (`.text-body-small`)
- **Caption**: 12px (`--text-xs`), Regular, Line-height 1.35 (`.text-caption`)
- **Label**: 12px (`--text-xs`), Semibold, Uppercase (`.text-label`)
- **Code**: JetBrains Mono (`.text-code`)
- **Navigation**: 14px (`--text-sm`), Medium (`.text-nav`)

### 1.4 Layout & Spacing
- `--sidebar-width`: `260px`
- `--content-max-width`: `900px`
- `--reading-max-width`: `720px`
- Spacing 8pt 기반: `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-6` (24px), `--space-8` (32px), `--space-12` (48px)
- Radii: `--radius-sm` (6px), `--radius-md` (10px), `--radius-lg` (16px), `--radius-full` (9999px)
- Transitions: Apple Ease-out curve `cubic-bezier(0.16, 1, 0.3, 1)` with 150ms ~ 220ms durations. `prefers-reduced-motion` 자동 지원.

---

## 2. Common UI Components (`src/components/ui/`)

모든 컴포넌트는 `src/components/ui`에서 일괄 임포트할 수 있습니다:

```typescript
import {
  Button,
  IconButton,
  Input,
  SearchInput,
  Badge,
  Card,
  Modal,
  Tooltip,
  Divider,
  EmptyState,
  Skeleton,
  LoadingIndicator,
} from '@/components/ui';
```

### 2.1 Button & IconButton
- **Button Props**:
  - `variant`: `'primary' | 'secondary' | 'ghost' | 'outline'` (기본값: `'primary'`)
  - `size`: `'sm' | 'md' | 'lg'` (기본값: `'md'`)
  - `isLoading`: boolean
  - `leftIcon`, `rightIcon`: React.ReactNode
- **IconButton Props**:
  - `icon`: React.ReactNode
  - `aria-label`: string (접근성 필수)
  - `variant`: `'ghost' | 'secondary' | 'outline'`
  - `size`: `'sm' | 'md' | 'lg'`

### 2.2 Input & SearchInput
- **Input Props**: `label`, `error`, `helperText`, `leftIcon`, `rightIcon`, 표준 HTML Input attributes
- **SearchInput Props**: `value`, `onChange`, `onClear`, 표준 Input 속성 (기본 검색 아이콘 및 클리어 버튼 내장)

### 2.3 Badge
- **Badge Props**:
  - `variant`: `'default' | 'outline' | 'subtle' | 'success' | 'warning' | 'danger'`
  - `size`: `'sm' | 'md'`

### 2.4 Card
- **Card Props**:
  - `interactive`: boolean (호버 시 미세 승강 효과)
  - `padding`: `'none' | 'sm' | 'md' | 'lg'`

### 2.5 Modal
- **Modal Props**:
  - `isOpen`: boolean
  - `onClose`: () => void
  - `title`: string
  - `size`: `'sm' | 'md' | 'lg' | 'full'`
  - 기능: 배경 블러 딤, `Esc` 키 감지 닫기, 스크롤 잠금, 키보드 접근성

### 2.6 Tooltip
- **Tooltip Props**:
  - `content`: React.ReactNode
  - `children`: React.ReactElement
  - `position`: `'top' | 'bottom' | 'left' | 'right'` (기본값: `'top'`)
  - `delayMs`: number (기본값: 200ms)

### 2.7 Feedback & Primitives
- **Divider**: `orientation` ('horizontal' | 'vertical'), `emphasis` ('subtle' | 'medium')
- **EmptyState**: `icon`, `title`, `description`, `action`
- **Skeleton**: `variant` ('text' | 'circular' | 'rectangular'), `width`, `height`
- **LoadingIndicator**: `size` ('sm' | 'md' | 'lg'), `label`
