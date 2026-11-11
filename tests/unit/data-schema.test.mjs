import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

function validateRichTextAnnotation(annotation, path) {
  const errors = [];
  if (typeof annotation !== 'object' || annotation === null) {
    return [`${path}: annotation must be an object`];
  }
  for (const field of ['bold', 'italic', 'strikethrough', 'underline', 'code']) {
    if (typeof annotation[field] !== 'boolean') {
      errors.push(`${path}.${field}: must be boolean, got ${typeof annotation[field]}`);
    }
  }
  if (annotation.color !== undefined && typeof annotation.color !== 'string') {
    errors.push(`${path}.color: must be string when provided`);
  }
  return errors;
}

function validateRichTextSpan(span, path) {
  const errors = [];
  if (typeof span !== 'object' || span === null) {
    return [`${path}: span must be an object`];
  }
  if (!['text', 'mention', 'equation'].includes(span.type)) {
    errors.push(`${path}.type: invalid type "${span.type}"`);
  }
  if (typeof span.plainText !== 'string') {
    errors.push(`${path}.plainText: must be string, got ${typeof span.plainText}`);
  }
  errors.push(...validateRichTextAnnotation(span.annotations, `${path}.annotations`));
  if (span.href !== undefined && span.href !== null && typeof span.href !== 'string') {
    errors.push(`${path}.href: must be string, null or undefined`);
  }
  return errors;
}

const ALLOWED_BLOCK_TYPES = new Set([
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
  'unknown'
]);

function validateBlock(block, path, seenIds) {
  const errors = [];
  if (typeof block !== 'object' || block === null) {
    return [`${path}: block must be an object`];
  }

  if (typeof block.id !== 'string' || block.id.trim() === '') {
    errors.push(`${path}.id: block.id must be non-empty string`);
  } else {
    if (seenIds.has(block.id)) {
      errors.push(`${path}.id: Duplicate block id "${block.id}" found`);
    }
    seenIds.add(block.id);
  }

  if (!ALLOWED_BLOCK_TYPES.has(block.type)) {
    errors.push(`${path}.type: Unknown/unsupported block type "${block.type}"`);
  }

  if (typeof block.hasChildren !== 'boolean') {
    errors.push(`${path}.hasChildren: must be boolean, got ${typeof block.hasChildren}`);
  }

  if (Array.isArray(block.richText)) {
    block.richText.forEach((span, i) => {
      errors.push(...validateRichTextSpan(span, `${path}.richText[${i}]`));
    });
  }

  if (block.type === 'to_do' && typeof block.checked !== 'boolean') {
    errors.push(`${path}.checked: to_do block must have boolean checked property`);
  }

  if (block.type === 'unknown') {
    if (typeof block.rawType !== 'string') {
      errors.push(`${path}.rawType: unknown block must specify rawType string`);
    }
    if (typeof block.migrationNotice !== 'string') {
      errors.push(`${path}.migrationNotice: unknown block must specify migrationNotice string`);
    }
  }

  if (Array.isArray(block.children)) {
    block.children.forEach((child, i) => {
      errors.push(...validateBlock(child, `${path}.children[${i}]`, seenIds));
    });
  }

  return errors;
}

function validatePage(page) {
  const errors = [];
  if (typeof page !== 'object' || page === null) {
    return { valid: false, errors: ['page must be an object'] };
  }

  if (typeof page.id !== 'string' || !page.id.trim()) {
    errors.push('page.id: must be non-empty string');
  }
  if (typeof page.title !== 'string' || !page.title.trim()) {
    errors.push('page.title: must be non-empty string');
  }
  if (typeof page.slug !== 'string' || !page.slug.trim()) {
    errors.push('page.slug: must be non-empty string');
  } else if (!/^[a-z0-9-_]+$/i.test(page.slug)) {
    errors.push(`page.slug: invalid slug format "${page.slug}"`);
  }
  if (page.parentId !== null && typeof page.parentId !== 'string') {
    errors.push('page.parentId: must be null or string');
  }
  if (typeof page.order !== 'number' || page.order < 0) {
    errors.push('page.order: must be a non-negative number');
  }
  if (!Array.isArray(page.blocks)) {
    errors.push('page.blocks: must be an array');
  } else {
    const seenBlockIds = new Set();
    page.blocks.forEach((block, idx) => {
      errors.push(...validateBlock(block, `page.blocks[${idx}]`, seenBlockIds));
    });
  }

  return { valid: errors.length === 0, errors };
}

test('Schema & Content Integrity: Validates welcome template page', () => {
  const filePath = join(process.cwd(), 'src/data/pages/welcome-unconfirmed-migration.json');
  assert.ok(existsSync(filePath), 'welcome-unconfirmed-migration.json must exist');
  
  const content = JSON.parse(readFileSync(filePath, 'utf-8'));
  const validation = validatePage(content);

  assert.equal(validation.valid, true, `Validation failed: ${validation.errors.join('; ')}`);
  assert.equal(content.metadata?.isUnconfirmedMigration, true, 'isUnconfirmedMigration flag must be true');
});

test('Schema & Content Integrity: Detects duplicate block IDs', () => {
  const invalidPage = {
    id: 'test-page-1',
    title: 'Duplicate Test',
    slug: 'duplicate-test',
    parentId: null,
    order: 1,
    blocks: [
      { id: 'block-same', type: 'paragraph', hasChildren: false, richText: [] },
      { id: 'block-same', type: 'paragraph', hasChildren: false, richText: [] }
    ],
    metadata: {}
  };

  const validation = validatePage(invalidPage);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some(e => e.includes('Duplicate block id "block-same"')));
});

test('Schema & Content Integrity: Detects invalid block types', () => {
  const invalidPage = {
    id: 'test-page-2',
    title: 'Type Test',
    slug: 'type-test',
    parentId: null,
    order: 1,
    blocks: [
      { id: 'b1', type: 'unsupported_magic_block', hasChildren: false }
    ],
    metadata: {}
  };

  const validation = validatePage(invalidPage);
  assert.equal(validation.valid, false);
  assert.ok(validation.errors.some(e => e.includes('Unknown/unsupported block type')));
});

test('Schema & Content Integrity: Validates registry.json structure and references', () => {
  const regPath = join(process.cwd(), 'src/data/registry.json');
  assert.ok(existsSync(regPath), 'registry.json must exist');
  
  const registry = JSON.parse(readFileSync(regPath, 'utf-8'));
  assert.ok(Array.isArray(registry), 'registry.json must be an array');
  assert.ok(registry.length > 0, 'registry.json must contain at least 1 entry');

  const registeredIds = new Set(registry.map((r) => r.id));
  for (const item of registry) {
    assert.ok(item.id, 'item must have id');
    assert.ok(item.title, 'item must have title');
    assert.ok(item.slug, 'item must have slug');
    if (item.parentId !== null) {
      assert.ok(registeredIds.has(item.parentId), `Parent ID "${item.parentId}" not in registry`);
    }
  }
});
