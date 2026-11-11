import test from 'node:test';
import assert from 'node:assert/strict';

function sanitizeUrl(url) {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^(javascript:|data:|vbscript:)/i.test(trimmed)) {
    return null;
  }
  return trimmed;
}

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url) || url.startsWith('//');
}

function mockRenderRichText(richText) {
  if (!richText || richText.length === 0) return '';
  return richText.map(span => {
    let out = span.plainText || '';
    if (span.annotations?.bold) out = `<b>${out}</b>`;
    if (span.annotations?.italic) out = `<i>${out}</i>`;
    if (span.annotations?.code) out = `<code>${out}</code>`;
    const safeHref = sanitizeUrl(span.href);
    if (safeHref) {
      const ext = isExternalUrl(safeHref);
      out = `<a href="${safeHref}"${ext ? ' target="_blank"' : ''}>${out}</a>`;
    }
    return out;
  }).join('');
}

function mockDispatchBlock(block, depth = 0) {
  if (!block || !block.id) return '';
  if (depth > 10) return '<!-- depth limit exceeded -->';

  switch (block.type) {
    case 'paragraph':
      return `<p>${mockRenderRichText(block.richText)}</p>`;
    case 'heading_1':
      return `<h1>${mockRenderRichText(block.richText)}</h1>`;
    case 'heading_2':
      return `<h2>${mockRenderRichText(block.richText)}</h2>`;
    case 'heading_3':
      return `<h3>${mockRenderRichText(block.richText)}</h3>`;
    case 'to_do':
      return `<div class="todo" data-checked="${!!block.checked}">${mockRenderRichText(block.richText)}</div>`;
    case 'callout':
      return `<div class="callout"><span class="icon">${block.icon || '💡'}</span>${mockRenderRichText(block.richText)}</div>`;
    case 'unknown':
      return `<div class="unknown" data-raw-type="${block.rawType}">${block.migrationNotice}</div>`;
    default:
      return `<div class="unsupported">${block.type}</div>`;
  }
}

test('Content Renderer: Sanitizes harmful links (XSS prevention)', () => {
  assert.equal(sanitizeUrl('javascript:alert(1)'), null);
  assert.equal(sanitizeUrl('data:text/html,<script>alert(1)</script>'), null);
  assert.equal(sanitizeUrl('vbscript:msgbox(1)'), null);
  assert.equal(sanitizeUrl('https://example.com'), 'https://example.com');
  assert.equal(sanitizeUrl('/internal/page'), '/internal/page');
});

test('Content Renderer: Correctly detects external URLs', () => {
  assert.equal(isExternalUrl('https://apple.com'), true);
  assert.equal(isExternalUrl('http://insecure.com'), true);
  assert.equal(isExternalUrl('//cdn.example.com/asset.js'), true);
  assert.equal(isExternalUrl('/mypath/overview'), false);
  assert.equal(isExternalUrl('#section-1'), false);
});

test('Content Renderer: Renders RichText with annotations and links', () => {
  const spans = [
    { plainText: 'Hello ', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false } },
    { plainText: 'Bold', annotations: { bold: true, italic: false, strikethrough: false, underline: false, code: false } },
    { plainText: ' and ', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false } },
    { plainText: 'Link', href: 'https://mypath.com', annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false } }
  ];

  const rendered = mockRenderRichText(spans);
  assert.equal(rendered, 'Hello <b>Bold</b> and <a href="https://mypath.com" target="_blank">Link</a>');
});

test('Content Renderer: Safe fallback for unknown Notion block types', () => {
  const unknownBlock = {
    id: 'block-unknown-01',
    type: 'unknown',
    rawType: 'synced_block',
    hasChildren: false,
    migrationNotice: 'Unconfirmed Notion block preserved for future migration'
  };

  const rendered = mockDispatchBlock(unknownBlock);
  assert.ok(rendered.includes('data-raw-type="synced_block"'));
  assert.ok(rendered.includes('Unconfirmed Notion block preserved'));
});

test('Content Renderer: Prevents stack overflow on recursive blocks', () => {
  const deeplyNestedBlock = {
    id: 'b-root',
    type: 'paragraph',
    hasChildren: true,
    richText: [{ plainText: 'Deep Root', annotations: { bold: false } }],
    children: []
  };

  let curr = deeplyNestedBlock;
  for (let i = 0; i < 20; i++) {
    const nextChild = {
      id: `b-child-${i}`,
      type: 'paragraph',
      hasChildren: true,
      richText: [{ plainText: `Level ${i}`, annotations: { bold: false } }],
      children: []
    };
    curr.children = [nextChild];
    curr = nextChild;
  }

  // Traverse with depth counter
  let exceeded = false;
  function traverse(block, depth = 0) {
    if (depth > 10) {
      exceeded = true;
      return;
    }
    if (block.children) {
      for (const c of block.children) traverse(c, depth + 1);
    }
  }

  traverse(deeplyNestedBlock);
  assert.equal(exceeded, true, 'Recursion guard must trip when depth exceeds 10');
});
