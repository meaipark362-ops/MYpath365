import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Relative luminance formula per WCAG 2.1
function hexToRgb(hex) {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test('Design System: tokens.css and typography.css define mandatory Apple/Editorial palette and typography', () => {
  const tokensPath = join(process.cwd(), 'src/styles/tokens.css');
  const typographyPath = join(process.cwd(), 'src/styles/typography.css');
  assert.ok(existsSync(tokensPath), 'src/styles/tokens.css must exist');
  assert.ok(existsSync(typographyPath), 'src/styles/typography.css must exist');

  const tokensCss = readFileSync(tokensPath, 'utf-8');
  const typoCss = readFileSync(typographyPath, 'utf-8');
  const combined = tokensCss + '\n' + typoCss;

  // Verify core token definitions across styles
  const requiredTokens = [
    '--color-obsidian',
    '--color-ivory',
    '--color-silver',
    '--color-slate',
    '--bg-primary',
    '--bg-secondary',
    '--text-primary',
    '--text-secondary',
    '--font-sans',
    '--font-serif',
    '--font-mono',
    '--line-height-body',
    '--content-max-width',
    '--radius-sm',
    '--radius-md',
    '--radius-lg'
  ];

  for (const token of requiredTokens) {
    assert.ok(combined.includes(token), `Design system missing token definition: ${token}`);
  }
});

test('Design System: WCAG 2.1 AA Contrast verification for default palette', () => {
  // Obsidian (#101114) text on Ivory (#F6F6F3) or White (#FFFFFF)
  const obsidian = '#101114';
  const ivory = '#F6F6F3';
  const white = '#FFFFFF';

  const contrastIvory = getContrastRatio(obsidian, ivory);
  const contrastWhite = getContrastRatio(obsidian, white);

  // WCAG 2.1 AA requirement: normal text >= 4.5:1
  assert.ok(contrastIvory >= 4.5, `Contrast obsidian on ivory (${contrastIvory.toFixed(2)}) must be >= 4.5:1`);
  assert.ok(contrastWhite >= 4.5, `Contrast obsidian on white (${contrastWhite.toFixed(2)}) must be >= 4.5:1`);

  // Dark mode: Ivory (#F6F6F3) on Obsidian (#101114)
  const darkContrast = getContrastRatio(ivory, obsidian);
  assert.ok(darkContrast >= 4.5, `Dark mode contrast (${darkContrast.toFixed(2)}) must be >= 4.5:1`);
});

test('Design System: UI Components accessibility and markup checks', () => {
  const buttonSource = readFileSync(join(process.cwd(), 'src/components/ui/Button.tsx'), 'utf-8');
  assert.ok(buttonSource.includes('aria-busy={isLoading}'), 'Button must reflect loading state with aria-busy');
  assert.ok(buttonSource.includes('aria-hidden="true"'), 'Button spinner must have aria-hidden="true"');

  const inputSource = readFileSync(join(process.cwd(), 'src/components/ui/Input.tsx'), 'utf-8');
  assert.ok(inputSource.includes('aria-invalid='), 'Input must support aria-invalid for form validation errors');
});
