#!/usr/bin/env node
// Verify (or update) integrity hashes for every file under vendor/.
//
// The manifest lives in vendor/CHECKSUMS.md as a fenced ```sha256sum block.
// On every build this script:
//   1. Parses the recorded <sha256>  <path> lines.
//   2. Walks vendor/ (excluding *.PATCH.md docs) and recomputes SHA-256.
//   3. Fails on: mismatched hash, file present without a recorded hash,
//      recorded hash pointing at a missing file.
//
// Run `node scripts/verify-vendor.mjs --update` to regenerate the block in
// CHECKSUMS.md after an intentional re-vendor — review the diff and commit.

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, posix, relative, sep } from 'node:path';

const ROOT = process.cwd();
const VENDOR = join(ROOT, 'vendor');
const CHECKSUMS = join(VENDOR, 'CHECKSUMS.md');
const BLOCK_OPEN = '```sha256sum\n';
const BLOCK_CLOSE = '```';

function fail(msg) {
  process.stderr.write(`[verify-vendor] FAIL: ${msg}\n`);
  process.exit(1);
}

function log(msg) {
  process.stdout.write(`[verify-vendor] ${msg}\n`);
}

function hashFile(absPath) {
  return createHash('sha256').update(readFileSync(absPath)).digest('hex');
}

// Walk a directory recursively and return relative POSIX paths of files,
// excluding documentation (*.PATCH.md) and the manifest itself
// (CHECKSUMS.md — chicken-and-egg: it holds the hashes).
const EXCLUDED = new Set(['CHECKSUMS.md']);
function listVendorFiles(dir, prefix = '') {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const abs = join(dir, entry);
    const rel = prefix ? posix.join(prefix, entry) : entry;
    if (statSync(abs).isDirectory()) {
      out.push(...listVendorFiles(abs, rel));
    } else if (!entry.endsWith('.PATCH.md') && !EXCLUDED.has(rel)) {
      out.push(rel);
    }
  }
  return out.sort();
}

function parseManifest(md) {
  const start = md.indexOf(BLOCK_OPEN);
  if (start === -1) fail(`could not find ${BLOCK_OPEN.trim()} block in CHECKSUMS.md`);
  const after = start + BLOCK_OPEN.length;
  const end = md.indexOf(BLOCK_CLOSE, after);
  if (end === -1) fail('unterminated sha256sum block in CHECKSUMS.md');
  const block = md.slice(after, end);
  const entries = new Map();
  for (const raw of block.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^([a-f0-9]{64})\s{2}(.+)$/);
    if (!m) fail(`malformed manifest line: ${line}`);
    const path = m[2];
    if (!path.startsWith('vendor/')) {
      fail(`manifest path must start with vendor/: ${path}`);
    }
    entries.set(path.slice('vendor/'.length), m[1]);
  }
  return { entries, blockStart: start, blockEnd: end + BLOCK_CLOSE.length };
}

const md = readFileSync(CHECKSUMS, 'utf8');
const { entries: recorded, blockStart, blockEnd } = parseManifest(md);
const present = listVendorFiles(VENDOR);

if (process.argv.includes('--update')) {
  const lines = present.map((p) => `${hashFile(join(VENDOR, p))}  vendor/${p}`);
  const updated =
    md.slice(0, blockStart) +
    BLOCK_OPEN +
    lines.join('\n') +
    '\n' +
    BLOCK_CLOSE +
    md.slice(blockEnd);
  writeFileSync(CHECKSUMS, updated);
  log(`updated CHECKSUMS.md with ${lines.length} entries`);
  process.exit(0);
}

const errors = [];
const seen = new Set();
for (const path of present) {
  seen.add(path);
  if (!recorded.has(path)) {
    errors.push(`vendor/${path} exists but has no recorded hash in CHECKSUMS.md`);
    continue;
  }
  const actual = hashFile(join(VENDOR, path));
  const expected = recorded.get(path);
  if (actual !== expected) {
    errors.push(
      `vendor/${path}: hash mismatch\n    expected ${expected}\n    actual   ${actual}`,
    );
  }
}
for (const path of recorded.keys()) {
  if (!seen.has(path)) {
    errors.push(`vendor/${path}: recorded in CHECKSUMS.md but file is missing`);
  }
}

if (errors.length) {
  for (const e of errors) process.stderr.write(`[verify-vendor] ${e}\n`);
  fail(
    `${errors.length} integrity error(s). If the change is intentional, run \`node scripts/verify-vendor.mjs --update\` and commit the CHECKSUMS.md diff.`,
  );
}

log(`verified ${present.length} vendor file(s) against CHECKSUMS.md`);
