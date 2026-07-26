import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { mdToHTML } from '../js/render/checkins.js';

test('headings, bold, code, lists, hr', () => {
  const html = mdToHTML('# Title\n\nSome **bold** and `code`.\n\n- one\n- two\n\n---');
  assert.ok(html.includes('<h3>Title</h3>'));
  assert.ok(html.includes('<strong>bold</strong>'));
  assert.ok(html.includes('<code>code</code>'));
  assert.ok(html.includes('<li>one</li>') && html.includes('<li>two</li>'));
  assert.ok(html.includes('<hr>'));
});

test('tables render with header and rows', () => {
  const html = mdToHTML('| A | B |\n|---|---|\n| 1 | 2 |\n| 3 | 4 |');
  assert.ok(html.includes('<th>A</th>') && html.includes('<th>B</th>'));
  assert.ok(html.includes('<td>1</td>') && html.includes('<td>4</td>'));
});

test('HTML in source is escaped, never injected', () => {
  const html = mdToHTML('hello <script>alert(1)</script> & <img src=x>');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&amp;'));
});

test('renders every real check-in doc without raw markdown leaking through', () => {
  const dir = new URL('../docs/checkins/', import.meta.url);
  for (const name of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const html = mdToHTML(readFileSync(new URL(name, dir), 'utf8'));
    assert.ok(html.length > 200, `${name}: output suspiciously small`);
    assert.ok(!/^#{1,4}\s/m.test(html), `${name}: unrendered heading`);
    assert.ok(!html.includes('**'), `${name}: unrendered bold`);
  }
});
