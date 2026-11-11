// src/data/schema-validator.ts

import {
  PageItemSchema,
  PageRegistryItemSchema,
  ContentManifestSchema,
  ContentBlockSchema,
} from '../types/schema';
import type { PageItem } from '../types/page';
import type { ContentManifest } from '../types/manifest';
import type { ContentBlock } from '../types/block';

export interface ValidationErrorDetail {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrorDetail[];
}

/**
 * 단일 ContentBlock 구조 및 필수 속성 검증
 */
export function validateContentBlock(block: unknown): ValidationResult {
  const result = ContentBlockSchema.safeParse(block);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    };
  }
  return { valid: true, errors: [] };
}

/**
 * 단일 PageItem 스키마 및 무결성 검증
 */
export function validatePageItem(page: unknown): ValidationResult {
  const result = PageItemSchema.safeParse(page);
  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  const typedPage = result.data as PageItem;
  const errors: ValidationErrorDetail[] = [];

  // 블록 ID 중복 검사
  const seenBlockIds = new Set<string>();
  const checkBlockIds = (blocks: ContentBlock[]) => {
    for (const b of blocks) {
      if (seenBlockIds.has(b.id)) {
        errors.push({
          path: `blocks[id=${b.id}]`,
          message: `Duplicate block ID detected: ${b.id}`,
        });
      }
      seenBlockIds.add(b.id);
      if (b.children && b.children.length > 0) {
        checkBlockIds(b.children);
      }
    }
  };

  checkBlockIds(typedPage.blocks);

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * 전체 ContentManifest 및 페이지 간의 참조/무결성/순환참조 검증
 */
export function validateManifestHierarchy(
  manifest: unknown,
  fullPages: PageItem[] = []
): ValidationResult {
  const parseResult = ContentManifestSchema.safeParse(manifest);
  if (!parseResult.success) {
    return {
      valid: false,
      errors: parseResult.error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  const typedManifest = parseResult.data as ContentManifest;
  const errors: ValidationErrorDetail[] = [];
  const pageIdSet = new Set<string>();
  const slugSet = new Set<string>();

  // 1. ID 및 Slug 고유성 검증
  for (const p of typedManifest.pages) {
    if (pageIdSet.has(p.id)) {
      errors.push({
        path: `manifest.pages[id=${p.id}]`,
        message: `Duplicate page ID in manifest: ${p.id}`,
      });
    }
    pageIdSet.add(p.id);

    if (slugSet.has(p.slug)) {
      errors.push({
        path: `manifest.pages[slug=${p.slug}]`,
        message: `Duplicate slug in manifest: ${p.slug}`,
      });
    }
    slugSet.add(p.slug);
  }

  // 2. 부모-자식 관계 및 존재 여부 검증
  const parentMap = new Map<string, string | null>();
  for (const p of typedManifest.pages) {
    parentMap.set(p.id, p.parentId);
    if (p.parentId !== null && !pageIdSet.has(p.parentId)) {
      errors.push({
        path: `manifest.pages[id=${p.id}].parentId`,
        message: `Parent page with ID "${p.parentId}" does not exist in manifest.`,
      });
    }
  }

  // 3. 순환 참조(Cycle) 검출
  for (const p of typedManifest.pages) {
    let curr: string | null = p.parentId;
    const visited = new Set<string>([p.id]);

    while (curr !== null) {
      if (visited.has(curr)) {
        errors.push({
          path: `manifest.pages[id=${p.id}]`,
          message: `Cyclic page parent-child reference detected at ID "${curr}".`,
        });
        break;
      }
      visited.add(curr);
      curr = parentMap.get(curr) || null;
    }
  }

  // 4. 개별 fullPage 상세 검증
  for (const page of fullPages) {
    const pageVal = validatePageItem(page);
    if (!pageVal.valid) {
      errors.push(...pageVal.errors.map((err) => ({
        path: `page[${page.id}].${err.path}`,
        message: err.message,
      })));
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
