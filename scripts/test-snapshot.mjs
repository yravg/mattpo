// Checks the committed snapshot. No network. Run: node scripts/test-snapshot.mjs
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ADAPTER_END, OWN, referencedSkills } from './sync.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const coverage = JSON.parse(fs.readFileSync(path.join(root, 'coverage.json'), 'utf8'));
const doc = fs.readFileSync(path.join(root, 'COVERAGE.md'), 'utf8');
const lock = JSON.parse(fs.readFileSync(path.join(root, 'upstream.lock.json'), 'utf8')).upstream;
// Driven by the lock, so it stays true after every upstream sync.
assert.match(lock.sha, /^[0-9a-f]{40}$/);
assert.equal(lock.repo, 'mattpocock/skills');
assert.match(lock.plugin_version, /^\d+\.\d+\.\d+/);
assert.match(fs.readFileSync(path.join(root, 'vendor/LICENSE'), 'utf8'), /MIT License/);
assert.match(fs.readFileSync(path.join(root, 'vendor/LICENSE'), 'utf8'), /Copyright \(c\) 2026 Matt Pocock/);
assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, 'vendor/LICENSE'))).digest('hex'), lock.license_sha256);
assert.match(fs.readFileSync(path.join(root, 'vendor/skills/engineering/pr/CREDITS.md'), 'utf8'), /Dex Horthy/);

const published = Object.keys(coverage.published);
assert.ok(published.length > 0);
const vendorOnly = published.filter((item) => coverage.published[item].disposition === 'vendor-only');
const exposed = published.filter((item) => coverage.published[item].disposition !== 'vendor-only');
assert.ok(exposed.length > 0);
for (const item of [...published, ...coverage.unpublished]) assert.ok(doc.includes(item), item);

const vendorFiles = [];
const walk = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    if (fs.lstatSync(abs).isDirectory()) walk(abs);
    else vendorFiles.push(path.relative(path.join(root, 'vendor'), abs).split(path.sep).join('/'));
  }
};
walk(path.join(root, 'vendor'));
assert.equal(vendorFiles.length, Object.keys(lock.files).length);
for (const file of vendorFiles) {
  const hash = createHash('sha256').update(fs.readFileSync(path.join(root, 'vendor', file))).digest('hex');
  assert.equal(hash, lock.files[file], file);
}
for (const item of coverage.unpublished) {
  assert.equal(vendorFiles.some((file) => file === item || file.startsWith(`${item}/`)), false, item);
}
for (const item of vendorOnly) {
  assert.equal(fs.existsSync(path.join(root, 'vendor', item, 'SKILL.md')), true, item);
  assert.equal(fs.existsSync(path.join(root, 'skills', item.split('/').at(-1))), false, item);
}

const exposedNames = new Set(exposed.map((item) => item.split('/').at(-1)));
for (const name of exposedNames) {
  const generated = fs.readFileSync(path.join(root, 'skills', name, 'SKILL.md'), 'utf8');
  assert.match(generated, /yravg adaptation/);
  const marker = `${ADAPTER_END}\n`;
  assert.equal(generated.includes(marker), true, name);
  const upstream = fs.readFileSync(path.join(root, 'vendor', exposed.find((item) => item.endsWith(`/${name}`)), 'SKILL.md'), 'utf8');
  const front = upstream.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)[0];
  assert.ok(generated.startsWith(front), name);
  assert.equal(generated.split(marker)[1], upstream.slice(front.length), name);
  for (const ref of referencedSkills(generated.split(marker)[1])) {
    assert.ok(exposedNames.has(ref), `${name} -> ${ref}`);
  }
}
for (const name of OWN) assert.equal(fs.existsSync(path.join(root, 'skills', name, 'SKILL.md')), true, name);
const plugin = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/plugin.json'), 'utf8'));
assert.equal(plugin.name, 'mattpo');
assert.match(plugin.version, /^\d+\.\d+\.\d+$/);
assert.equal(plugin.license, 'MIT');
const market = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/marketplace.json'), 'utf8'));
assert.deepEqual(market.plugins.map((p) => [p.name, p.source]), [['mattpo', './']]);
assert.match(fs.readFileSync(path.join(root, 'LICENSE'), 'utf8'), /MIT License/);
assert.match(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), /\/mattpo:mattpo-mode/);
assert.doesNotMatch(fs.readFileSync(path.join(root, 'README.md'), 'utf8'), /tested in Claude Code|installed and tested/i);

console.log(`test-snapshot: ${lock.sha.slice(0, 12)} ${published.length} published, ${exposed.length} exposed, ${vendorOnly.length} vendor-only, ${coverage.unpublished.length} unpublished`);
