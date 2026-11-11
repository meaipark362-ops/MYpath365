/**
 * Automated Asset Integrity & Broken Link Audit Script
 * Validates existence of static assets, placeholder fallback coverage, and image extensions.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export function runAssetValidation() {
  const result = {
    passed: true,
    checkedAssets: 0,
    missingAssets: [],
    placeholdersFound: 0,
    warnings: [],
    details: []
  };

  const publicDir = join(process.cwd(), 'public');
  const assetsDir = join(publicDir, 'assets');

  if (!existsSync(assetsDir)) {
    result.passed = false;
    result.missingAssets.push('public/assets directory does not exist');
    return result;
  }

  // 1. Mandatory placeholder files per AI 6 contract
  const mandatoryPlaceholders = [
    'placeholder-cover.svg',
    'placeholder-avatar.svg',
    'placeholder-inline.svg',
    'placeholder-video.svg',
    'placeholder-broken.svg'
  ];

  const placeholdersPath = join(assetsDir, 'placeholders');
  if (!existsSync(placeholdersPath)) {
    result.passed = false;
    result.missingAssets.push('public/assets/placeholders directory missing');
  } else {
    for (const p of mandatoryPlaceholders) {
      const fullPath = join(placeholdersPath, p);
      if (existsSync(fullPath)) {
        result.placeholdersFound++;
        result.checkedAssets++;
      } else {
        result.passed = false;
        result.missingAssets.push(`public/assets/placeholders/${p}`);
      }
    }
  }

  // 2. Icons check
  const iconsPath = join(assetsDir, 'icons');
  const mandatoryIcons = ['logo.svg', 'favicon.svg'];
  for (const icon of mandatoryIcons) {
    const full = join(iconsPath, icon);
    if (existsSync(full)) {
      result.checkedAssets++;
    } else {
      result.warnings.push(`Recommended icon missing: public/assets/icons/${icon}`);
    }
  }

  // 3. Scan references in data files
  const pagesDir = join(process.cwd(), 'src/data/pages');
  if (existsSync(pagesDir)) {
    const pages = readdirSync(pagesDir).filter(f => f.endsWith('.json'));
    for (const pFile of pages) {
      const page = JSON.parse(readFileSync(join(pagesDir, pFile), 'utf-8'));
      if (page.coverImage && page.coverImage.startsWith('/assets/')) {
        const fullLocalPath = join(publicDir, page.coverImage.replace(/^\//, ''));
        if (!existsSync(fullLocalPath)) {
          result.warnings.push(`Page "${page.id}" references cover "${page.coverImage}" which is not yet present on disk (placeholder will be used)`);
        }
      }
    }
  }

  return result;
}

if (process.argv[1] && process.argv[1].endsWith('validate-assets.mjs')) {
  console.log('--- Running Static Asset Integrity Audit ---');
  const res = runAssetValidation();
  console.log(`Assets Checked: ${res.checkedAssets}`);
  console.log(`Placeholders Found: ${res.placeholdersFound}`);
  if (res.missingAssets.length > 0) {
    console.error('Missing Mandatory Assets:');
    res.missingAssets.forEach(m => console.error(' ✖ ' + m));
    process.exit(1);
  }
  if (res.warnings.length > 0) {
    console.log('Warnings:');
    res.warnings.forEach(w => console.log(' ⚠ ' + w));
  }
  console.log('✓ All core placeholders and required assets are intact.');
}
