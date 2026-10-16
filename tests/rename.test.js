import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const manifest = JSON.parse(readFileSync(new URL('../manifest.json', import.meta.url)));

test('manifest uses the agreed name', () => {
  assert.equal(manifest.name, 'UTM Builder & Checker for GA4 – The Growth Folks®');
  assert.equal(manifest.short_name, 'UTM Builder');
  assert.ok(manifest.name.length <= 75);
  assert.ok(manifest.description.length <= 132);
});

test('no visible "UTM Governor" left in the shipped package', () => {
  const walk = d => readdirSync(d).flatMap(f => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  const files = walk(new URL('../src', import.meta.url).pathname).filter(f => /\.(html|js|css)$/.test(f));
  const hits = files.filter(f => /UTM Governor/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(hits, []);
});

test('contact email is team@', () => {
  const walk = d => readdirSync(d).flatMap(f => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
  const files = walk(new URL('../src', import.meta.url).pathname).filter(f => /\.(html|js)$/.test(f));
  assert.deepEqual(files.filter(f => /hello@thegrowthfolks/.test(readFileSync(f, 'utf8'))), []);
});
