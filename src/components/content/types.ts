/**
 * Content Engine Types
 * Based on Data Contract (Section 3 of docs/architecture/interface-contracts.md)
 */

export type BlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'to_do'
  | 'toggle'
  | 'callout'
  | 'quote'
  | 'divider'
  | 'table'
  | 'code'
  | 'image'
  | 'video'
  | 'bookmark'
  | 'child_page'
  | 'unknown';

export interface RichTextAnnotation {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
}

export interface RichTextSpan {
  type: 'text' | 'mention' | 'equation';
  plainText: string;
  annotations?: RichTextAnnotation;
  href?: string | null;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  children?: ContentBlock[];
  hasChildren?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ParagraphBlockData extends BaseBlock {
  type: 'paragraph';
  richText: RichTextSpan[];
}

export interface HeadingBlockData extends BaseBlock {
  type: 'heading_1' | 'heading_2' | 'heading_3';
  richText: RichTextSpan[];
  isToggleable?: boolean;
}

export interface BulletedListItemBlockData extends BaseBlock {
  type: 'bulleted_list_item';
  richText: RichTextSpan[];
}

export interface NumberedListItemBlockData extends BaseBlock {
  type: 'numbered_list_item';
  richText: RichTextSpan[];
}

export interface TodoBlockData extends BaseBlock {
  type: 'to_do';
  richText: RichTextSpan[];
  checked: boolean;
}

export interface ToggleBlockData extends BaseBlock {
  type: 'toggle';
  richText: RichTextSpan[];
  defaultOpen?: boolean;
}

export interface CalloutBlockData extends BaseBlock {
  type: 'callout';
  richText: RichTextSpan[];
  icon?: string;
}

export interface QuoteBlockData extends BaseBlock {
  type: 'quote';
  richText: RichTextSpan[];
}

export interface DividerBlockData extends BaseBlock {
  type: 'divider';
}

export interface TableRowData {
  cells: RichTextSpan[][];
}

export interface TableBlockData extends BaseBlock {
  type: 'table';
  tableWidth?: number;
  hasColumnHeader?: boolean;
  hasRowHeader?: boolean;
  rows?: TableRowData[];
}

export interface CodeBlockData extends BaseBlock {
  type: 'code';
  richText: RichTextSpan[];
  language?: string;
  caption?: RichTextSpan[];
}

export interface ImageBlockData extends BaseBlock {
  type: 'image';
  url: string;
  caption?: RichTextSpan[];
  alt?: string;
  aspectRatio?: string;
}

export interface VideoBlockData extends BaseBlock {
  type: 'video';
  url: string;
  caption?: RichTextSpan[];
}

export interface BookmarkBlockData extends BaseBlock {
  type: 'bookmark';
  url: string;
  title?: string;
  description?: string;
  icon?: string;
  coverImage?: string;
}

export interface ChildPageBlockData extends BaseBlock {
  type: 'child_page';
  title: string;
  pageId?: string;
  icon?: string;
}

export interface UnknownBlockData extends BaseBlock {
  type: 'unknown';
  rawType?: string;
  rawData?: unknown;
  migrationNotice?: string;
}

export type ContentBlock =
  | ParagraphBlockData
  | HeadingBlockData
  | BulletedListItemBlockData
  | NumberedListItemBlockData
  | TodoBlockData
  | ToggleBlockData
  | CalloutBlockData
  | QuoteBlockData
  | DividerBlockData
  | TableBlockData
  | CodeBlockData
  | ImageBlockData
  | VideoBlockData
  | BookmarkBlockData
  | ChildPageBlockData
  | UnknownBlockData
  | (BaseBlock & {
      richText?: RichTextSpan[];
      [key: string]: unknown;
    });

export interface ContentBlockProps<T extends ContentBlock = ContentBlock> {
  block: T;
  depth?: number;
  enableInteractiveToggles?: boolean;
  completedTodos?: Record<string, boolean>;
  onBlockAction?: (blockId: string, action: string, payload?: unknown) => void;
  renderChildBlocks?: (blocks?: ContentBlock[], depth?: number) => React.ReactNode;
}
