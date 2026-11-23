#!/usr/bin/env node
// Bump the patch version in .claude-plugin/plugin.json so Claude Code sees an update.
// Run: node scripts/bump-version.mjs   (prints the new version)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const file = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.claude-plugin', 'plugin.json');
const plugin = JSON.parse(fs.readFileSync(file, 'utf8'));
const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(plugin.version);
if (!m) throw new Error(`plugin.json version is not x.y.z: ${plugin.version}`);
plugin.version = `${m[1]}.${m[2]}.${Number(m[3]) + 1}`;
fs.writeFileSync(file, JSON.stringify(plugin, null, 2) + '\n');
console.log(plugin.version);
