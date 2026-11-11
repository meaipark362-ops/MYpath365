// src/types/schema.ts

import { z } from 'zod';

export const BlockTypeSchema = z.enum([
  'paragraph',
  'heading_1',
  'heading_2',
  'heading_3',
  'bulleted_list_item',
  'numbered_list_item',
  'to_do',
  'toggle',
  'callout',
  'quote',
  'divider',
  'table',
  'table_row',
  'code',
  'image',
  'video',
  'bookmark',
  'child_page',
  'file',
  'unknown',
]);

export const RichTextAnnotationSchema = z.object({
  bold: z.boolean(),
  italic: z.boolean(),
  strikethrough: z.boolean(),
  underline: z.boolean(),
  code: z.boolean(),
  color: z.string().optional(),
});

export const RichTextSpanSchema = z.object({
  type: z.enum(['text', 'mention', 'equation']),
  plainText: z.string(),
  annotations: RichTextAnnotationSchema,
  href: z.string().nullable().optional(),
});

export const BaseBlockSchema = z.object({
  id: z.string().min(1, 'Block ID is required'),
  type: BlockTypeSchema,
  hasChildren: z.boolean(),
  metadata: z.record(z.unknown()).optional(),
});

// Lazy content block schema to allow recursive child blocks
export const ContentBlockSchema: z.ZodType<any> = BaseBlockSchema.extend({
  children: z.lazy(() => z.array(ContentBlockSchema)).optional(),
  richText: z.array(RichTextSpanSchema).optional(),
  checked: z.boolean().optional(),
  icon: z.string().optional(),
  isToggleable: z.boolean().optional(),
  url: z.string().optional(),
  alt: z.string().optional(),
  aspectRatio: z.string().optional(),
  language: z.string().optional(),
  caption: z.array(RichTextSpanSchema).optional(),
  rawType: z.string().optional(),
  rawData: z.unknown().optional(),
  migrationNotice: z.string().optional(),
  tableWidth: z.number().optional(),
  hasColumnHeader: z.boolean().optional(),
  hasRowHeader: z.boolean().optional(),
  cells: z.array(z.array(RichTextSpanSchema)).optional(),
  pageId: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  size: z.number().optional(),
});

export const PageMetadataSchema = z.object({
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  readingTimeMinutes: z.number().optional(),
  isUnconfirmedMigration: z.boolean().optional(),
});

export const PageItemSchema = z.object({
  id: z.string().min(1, 'Page ID is required'),
  title: z.string().min(1, 'Page title is required'),
  slug: z.string().min(1, 'Page slug is required'),
  parentId: z.string().nullable(),
  icon: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  order: z.number(),
  blocks: z.array(ContentBlockSchema),
  metadata: PageMetadataSchema,
});

export const PageRegistryItemSchema = z.object({
  id: z.string().min(1, 'Page ID is required'),
  title: z.string().min(1, 'Page title is required'),
  slug: z.string().min(1, 'Page slug is required'),
  parentId: z.string().nullable(),
  icon: z.string().nullable().optional(),
  order: z.number(),
  childPageIds: z.array(z.string()),
});

export const ContentManifestMetadataSchema = z.object({
  generatedAt: z.string(),
  totalPages: z.number(),
  environment: z.enum(['development', 'production', 'staging']),
  notionExportDetected: z.boolean(),
  notes: z.string().optional(),
});

export const ContentManifestSchema = z.object({
  version: z.string(),
  metadata: ContentManifestMetadataSchema,
  pages: z.array(PageRegistryItemSchema),
});

export const UserPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  fontSize: z.enum(['normal', 'large']),
  sidebarCollapsed: z.boolean(),
});

export const UserDataModelSchema = z.object({
  favorites: z.array(z.string()),
  completedTodos: z.record(z.boolean()),
  readingProgress: z.record(z.number()),
  preferences: UserPreferencesSchema,
  lastVisitedPageId: z.string().nullable().optional(),
  updatedAt: z.string().optional(),
});
