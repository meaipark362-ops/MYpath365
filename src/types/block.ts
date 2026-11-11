// src/types/block.ts

/**
 * Notion AST 호환 블록 타입 정의
 * Notion의 다양한 블록 형태를 손실 없이 표현하며 미지원 블록은 unknown으로 보존합니다.
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
  | 'table_row'
  | 'code'
  | 'image'
  | 'video'
  | 'bookmark'
  | 'child_page'
  | 'file'
  | 'unknown';

export interface RichTextAnnotation {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color?: string;
}

export interface RichTextSpan {
  type: 'text' | 'mention' | 'equation';
  plainText: string;
  annotations: RichTextAnnotation;
  href?: string | null;
}

export interface BaseBlock {
  id: string;
  type: BlockType;
  children?: ContentBlock[];
  hasChildren: boolean;
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

export interface ListItemBlockData extends BaseBlock {
  type: 'bulleted_list_item' | 'numbered_list_item';
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

export interface TableRowBlockData extends BaseBlock {
  type: 'table_row';
  cells: RichTextSpan[][];
}

export interface TableBlockData extends BaseBlock {
  type: 'table';
  tableWidth: number;
  hasColumnHeader: boolean;
  hasRowHeader: boolean;
  children?: TableRowBlockData[];
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
  favicon?: string;
}

export interface ChildPageBlockData extends BaseBlock {
  type: 'child_page';
  pageId: string;
  title: string;
}

export interface FileBlockData extends BaseBlock {
  type: 'file';
  url: string;
  name: string;
  size?: number;
}

export interface UnknownBlockData extends BaseBlock {
  type: 'unknown';
  rawType: string;
  rawData?: unknown;
  migrationNotice: string;
}

export type ContentBlock =
  | ParagraphBlockData
  | HeadingBlockData
  | ListItemBlockData
  | TodoBlockData
  | ToggleBlockData
  | CalloutBlockData
  | QuoteBlockData
  | DividerBlockData
  | TableBlockData
  | TableRowBlockData
  | CodeBlockData
  | ImageBlockData
  | VideoBlockData
  | BookmarkBlockData
  | ChildPageBlockData
  | FileBlockData
  | UnknownBlockData;
