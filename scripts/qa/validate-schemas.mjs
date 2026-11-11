/**
 * Automated Schema & Content Integrity Audit Script
 * Validates all JSON files in src/data against Notion AST and Page Schema contracts.
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

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

function validateBlock(block, path, errors, seenIds, stats) {
  stats.totalBlocks++;
  if (!block || typeof block !== 'object') {
    errors.push(`${path}: block must be an object`);
    return;
  }

  if (!block.id || typeof block.id !== 'string') {
    errors.push(`${path}: block must have non-empty string id`);
  } else {
    if (seenIds.has(block.id)) {
      errors.push(`${path}: Duplicate block id "${block.id}"`);
    }
    seenIds.add(block.id);
  }

  if (!ALLOWED_BLOCK_TYPES.has(block.type)) {
    errors.push(`${path}: Unsupported block type "${block.type}"`);
  }

  if (block.type === 'unknown') {
    stats.unknownBlocks++;
  }

  if (Array.isArray(block.children)) {
    block.children.forEach((child, i) => {
      validateBlock(child, `${path}.children[${i}]`, errors, seenIds, stats);
    });
  }
}

export function runSchemaValidation() {
  const result = {
    passed: true,
    pagesChecked: 0,
    invalidPages: [],
    unknownBlocksFound: 0,
    totalBlocksScanned: 0,
    errors: []
  };

  const pagesDir = join(process.cwd(), 'src/data/pages');
  if (!existsSync(pagesDir)) {
    result.passed = false;
    result.errors.push(`Pages directory not found at ${pagesDir}`);
    return result;
  }

  const files = readdirSync(pagesDir).filter(f => f.endsWith('.json'));
  const stats = { totalBlocks: 0, unknownBlocks: 0 };

  for (const file of files) {
    result.pagesChecked++;
    const fullPath = join(pagesDir, file);
    try {
      const page = JSON.parse(readFileSync(fullPath, 'utf-8'));
      const pageErrors = [];
      const seenIds = new Set();

      if (!page.id) pageErrors.push(`Missing page id`);
      if (!page.title) pageErrors.push(`Missing page title`);
      if (!page.slug) pageErrors.push(`Missing page slug`);
      if (!Array.isArray(page.blocks)) pageErrors.push(`Missing blocks array`);
      else {
        page.blocks.forEach((b, i) => {
          validateBlock(b, `page[${file}].blocks[${i}]`, pageErrors, seenIds, stats);
        });
      }

      if (pageErrors.length > 0) {
        result.passed = false;
        result.invalidPages.push(file);
        result.errors.push(...pageErrors.map(e => `[${file}] ${e}`));
      }
    } catch (err) {
      result.passed = false;
      result.invalidPages.push(file);
      result.errors.push(`[${file}] Failed to parse JSON: ${err.message}`);
    }
  }

  result.unknownBlocksFound = stats.unknownBlocks;
  result.totalBlocksScanned = stats.totalBlocks;
  return result;
}

if (process.argv[1] && process.argv[1].endsWith('validate-schemas.mjs')) {
  console.log('--- Running Schema & Content Integrity Validation ---');
  const audit = runSchemaValidation();
  console.log(`Pages Checked: ${audit.pagesChecked}`);
  console.log(`Total Blocks Scanned: ${audit.totalBlocksScanned}`);
  console.log(`Unknown Blocks Preserved: ${audit.unknownBlocksFound}`);
  if (!audit.passed) {
    console.error('Validation FAILED with errors:');
    audit.errors.forEach(e => console.error(' - ' + e));
    process.exit(1);
  } else {
    console.log('✓ All content schemas and page hierarchies are 100% valid.');
  }
}
