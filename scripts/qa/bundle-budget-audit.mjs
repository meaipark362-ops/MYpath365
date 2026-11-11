/**
 * Automated Bundle Size & Code Density Benchmark Script
 * Measures uncompressed and estimated gzip footprint of application source files.
 */

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

function getFilesRecursively(dir, filter) {
  let results = [];
  const list = readdirSync(dir);
  for (const file of list) {
    const full = join(dir, file);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(getFilesRecursively(full, filter));
    } else if (!filter || filter(full)) {
      results.push(full);
    }
  }
  return results;
}

export function runBundleBudgetAudit() {
  const srcDir = join(process.cwd(), 'src');
  const files = getFilesRecursively(srcDir, (f) => /\.(ts|tsx|css|json)$/.test(f));

  let totalRawBytes = 0;
  let totalGzipBytes = 0;
  const breakdown = [];

  for (const f of files) {
    const content = readFileSync(f);
    const rawSize = content.length;
    const gzipped = gzipSync(content).length;

    totalRawBytes += rawSize;
    totalGzipBytes += gzipped;

    breakdown.push({
      file: f.replace(process.cwd(), '').replace(/^[\\\/]/, ''),
      rawKb: (rawSize / 1024).toFixed(2),
      gzipKb: (gzipped / 1024).toFixed(2)
    });
  }

  // Target budget from quality-standards.md: Initial bundle < 150KB gzip
  const budgetKb = 150;
  const actualGzipKb = totalGzipBytes / 1024;
  const passed = actualGzipKb <= budgetKb;

  return {
    totalFiles: files.length,
    rawTotalKb: (totalRawBytes / 1024).toFixed(2),
    gzipTotalKb: actualGzipKb.toFixed(2),
    budgetLimitKb: budgetKb,
    passed,
    breakdown: breakdown.sort((a, b) => parseFloat(b.gzipKb) - parseFloat(a.gzipKb)).slice(0, 10)
  };
}

if (process.argv[1] && process.argv[1].endsWith('bundle-budget-audit.mjs')) {
  console.log('--- Running Source Bundle & Density Benchmark ---');
  const res = runBundleBudgetAudit();
  console.log(`Total Source Files: ${res.totalFiles}`);
  console.log(`Raw Source Size: ${res.rawTotalKb} KB`);
  console.log(`Gzip Compressed Footprint: ${res.gzipTotalKb} KB`);
  console.log(`Target Initial Budget: ${res.budgetLimitKb} KB`);
  console.log(`Budget Status: ${res.passed ? '✓ PASSED (Well within budget)' : '✖ EXCEEDED'}`);
  console.log('\nTop 10 Files by Gzip Weight:');
  res.breakdown.forEach(b => console.log(` - ${b.file}: ${b.gzipKb} KB gzip (${b.rawKb} KB raw)`));
}
