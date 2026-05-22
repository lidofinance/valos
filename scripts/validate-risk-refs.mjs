#!/usr/bin/env node
// Validates risk references in valos-spec.html.
//
// Checks:
//   1. Risk labels match their anchor links     (e.g. [SEC1](#risk-sec-1) ✓)
//   2. No duplicate risk IDs in the same bullet (e.g. * [SEC1] foo [SEC1] bar)
//   3. All referenced risk IDs exist as anchors in the document
//
// Exit 0 on success, 1 on any validation error.

import { readFileSync } from 'node:fs';

const SPEC_FILE = 'valos-spec.html';
const text = readFileSync(SPEC_FILE, 'utf8');
const lines = text.split(/\r?\n/);

const errors = [];

// ── Check 1: label/link mismatches ──────────────────────────────────────────
// Match e.g. `[SEC1](#risk-sec-1)` and verify the label letters+digits match
// the anchor's prefix+digits.
const labelLinkRe = /\[([A-Z]+[0-9]*)\]\(#risk-([a-z]+)-([0-9]+)\)/g;
lines.forEach((line, i) => {
  for (const m of line.matchAll(labelLinkRe)) {
    const [, label, prefix, num] = m;
    const expected = `${prefix.toUpperCase()}${num}`;
    if (label !== expected) {
      errors.push(
        `Line ${i + 1}: Label mismatch [${label}](#risk-${prefix}-${num}) (label: ${label}, expected: ${expected})`,
      );
    }
  }
});

// ── Check 2: duplicates within a single risk-list bullet line ───────────────
const bulletRiskIdRe = /\[([A-Z]+[0-9]+)\]/g;
lines.forEach((line, i) => {
  if (!line.startsWith('* [')) return;
  const ids = [...line.matchAll(bulletRiskIdRe)].map((m) => m[1]);
  const seen = new Set();
  const dupes = new Set();
  for (const id of ids) {
    if (seen.has(id)) dupes.add(id);
    seen.add(id);
  }
  if (dupes.size) {
    errors.push(
      `Line ${i + 1} has duplicate risks: ${[...dupes].join(', ')}`,
    );
  }
});

// ── Check 3: referenced risks exist as id="risk-..." anchors ────────────────
const defined = new Set();
const idAnchorRe = /id="(risk-[a-z]+-[0-9]+)"/g;
for (const m of text.matchAll(idAnchorRe)) {
  defined.add(m[1]);
}

const refRe = /#(risk-[a-z]+-[0-9]+)/g;
lines.forEach((line, i) => {
  for (const m of line.matchAll(refRe)) {
    const ref = m[1];
    if (!defined.has(ref)) {
      errors.push(
        `Line ${i + 1}: Referenced risk '${ref}' does not exist in risk table`,
      );
    }
  }
});

// ── Report ──────────────────────────────────────────────────────────────────
if (errors.length) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  console.error(`\nFAILED: Found ${errors.length} error(s)`);
  process.exit(1);
} else {
  console.log('PASSED: All risk reference checks passed');
}
