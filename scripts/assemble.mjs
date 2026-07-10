#!/usr/bin/env node
// Assemble stage: compile structured sources into the ReSpec input document.
//
//   risks/*.yaml + controls/*.yaml + mitigations/*.md + templates/**
//     -> valos-spec.html   (the committed ReSpec input, same as before)
//
// Also exports buildDataset() used by build.mjs to emit dist/valos.json.
//
// Security model (issue #2): risks/, controls/ and mitigations/ are the
// externally-contributable surface. A PR limited to those paths cannot
// change executable output:
//   - every plain scalar field is HTML-escaped at interpolation
//   - fields that would carry markup are structured instead (retired,
//     columns) and regenerated from validated ids
//   - rich markdown content passes the fail-closed allowlist linter
//     (scripts/lint-content.mjs); templates/flow/ is linted too as
//     defense in depth
//   - all ids in the assembled document are globally unique
// Cross-references are validated here: unique entity IDs, no dangling risk
// references anywhere in the assembled document (superset of the retired
// validate-risk-refs.mjs checks).

import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as YAML from 'yaml';
import { lintText } from './lint-content.mjs';

const ROOT = process.cwd();
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n');
const loadYaml = (rel) => YAML.parse(read(rel), { strict: true });

const errors = [];
const fail = (msg) => errors.push(msg);

const escapeHtml = (s) =>
  String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
const lint = (text, file) => { for (const e of lintText(String(text), file)) fail(e); };

// ── load sources ────────────────────────────────────────────────────────────
const riskFiles = readdirSync(join(ROOT, 'risks')).filter((f) => f.endsWith('.yaml'));
const ctrlFiles = readdirSync(join(ROOT, 'controls')).filter((f) => f.endsWith('.yaml'));
const mitFiles = readdirSync(join(ROOT, 'mitigations')).filter((f) => f.endsWith('.md'));

const riskCats = new Map(); // slug -> {section, columns, risks}
for (const f of riskFiles) riskCats.set(f.replace(/\.yaml$/, ''), loadYaml(`risks/${f}`));

const ctrlSecs = new Map(); // slug -> {section, controls}
for (const f of ctrlFiles) ctrlSecs.set(f.replace(/\.yaml$/, ''), loadYaml(`controls/${f}`));

function splitFrontmatter(src, name) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!m) throw new Error(`missing frontmatter: ${name}`);
  return { data: YAML.parse(m[1], { strict: true }), body: src.slice(m[0].length) };
}
const mitigations = new Map(); // id -> {data, body}
for (const f of mitFiles) {
  const { data, body } = splitFrontmatter(read(`mitigations/${f}`), f);
  if (mitigations.has(data.id)) fail(`duplicate mitigation id: ${data.id}`);
  if (!/^sec-mit-[a-z0-9-]+$/.test(data.id)) fail(`${f}: mitigation id must match sec-mit-*: ${data.id}`);
  mitigations.set(data.id, { ...data, body: body.trim(), file: f });
  lint(body, `mitigations/${f}`);
}

// ── id registries ───────────────────────────────────────────────────────────
const riskAnchor = (id) => {
  const m = /^([A-Z]+)(\d+)$/.exec(id);
  if (!m) throw new Error(`bad risk id: ${id}`);
  return `risk-${m[1].toLowerCase()}-${m[2]}`;
};
const riskIds = new Map(); // FIN1 -> category slug
for (const [slug, cat] of riskCats) {
  for (const r of cat.risks) {
    if (riskIds.has(r.id)) fail(`duplicate risk id: ${r.id}`);
    riskIds.set(r.id, slug);
    if (!r.retired) for (const k of ['group', 'vector', 'description'])
      if (!r[k]) fail(`risk ${r.id}: missing ${k}`);
  }
}
// second pass: retirement references can point at any category
for (const [, cat] of riskCats)
  for (const r of cat.risks) {
    for (const ref of r.replaces ?? []) if (!riskIds.has(ref)) fail(`risk ${r.id}: replaces unknown ${ref}`);
    if (r.retired && r.retired !== 'removed') {
      for (const ref of r.retired.replacedBy ?? []) if (!riskIds.has(ref)) fail(`risk ${r.id}: replacedBy unknown ${ref}`);
      if (r.retired.mergedInto && !riskIds.has(r.retired.mergedInto)) fail(`risk ${r.id}: mergedInto unknown ${r.retired.mergedInto}`);
    }
  }
const reqIds = new Set();
for (const [slug, sec] of ctrlSecs)
  for (const c of sec.controls)
    for (const req of c.requirements) {
      if (reqIds.has(req.id)) fail(`duplicate requirement id: ${req.id}`);
      reqIds.add(req.id);
      if (!/^req-[a-z0-9-]+$/.test(req.id)) fail(`requirement id must match req-*: ${req.id}`);
      if (!/\b(MUST|SHOULD|MAY)\b/.test(req.statement))
        fail(`requirement ${req.id}: statement has no conformance keyword`);
      if (req.joinNext !== undefined && !/^[,;]?\s*$/.test(req.joinNext))
        fail(`requirement ${req.id}: joinNext must be a short punctuation joiner`);
    }

// ── generators ──────────────────────────────────────────────────────────────
function genRetired(retired) {
  if (retired === 'removed') return 'Removed';
  if (retired.replacedBy)
    return `Replaced by ${retired.replacedBy.map((id) => `<a href="#${riskAnchor(id)}">${id}</a>`).join(', ')}`;
  if (retired.mergedInto)
    return `This risk has been merged into <a href="#${riskAnchor(retired.mergedInto)}">${retired.mergedInto}</a>`;
  throw new Error(`unknown retired shape: ${JSON.stringify(retired)}`);
}

function genRiskTable(cat, slug) {
  for (const col of cat.columns) {
    if (col.width && !/^\d+%$/.test(col.width)) fail(`risks/${slug}: bad column width ${col.width}`);
  }
  const thead = `<thead>\n<tr>\n${cat.columns
    .map((c) => `<th${c.width ? ` width="${c.width}"` : ''}>${escapeHtml(c.label)}</th>`)
    .join('\n')}\n</tr></thead>`;
  const rows = cat.risks.map((r) => {
    if (r.retired)
      return `<tr id="${riskAnchor(r.id)}">\n  <td>${r.id}</td>\n  <td colspan="4">${genRetired(r.retired)}</td>\n</tr>`;
    const label = r.replaces ? `${r.id} (replaces ${r.replaces.join(', ')})` : r.id;
    // descriptions are rich-lite (corpus uses <br> and one <ul> list) — linted
    lint(r.description, `risks/${slug}.yaml#${r.id}.description`);
    return `<tr id="${riskAnchor(r.id)}">\n  <td>${label}</td>\n  <td>${escapeHtml(r.group)}</td>\n  <td>${escapeHtml(r.vector)}</td>\n  <td>${r.description}</td>\n  <td><ul class="autofill-mits"></ul></td>\n</tr>`;
  });
  return `<table>\n${thead}\n<tbody>\n${rows.join('\n')}\n</tbody>\n</table>`;
}

function genRiskCategory(slug) {
  const cat = riskCats.get(slug);
  if (!cat) throw new Error(`unknown risk category: ${slug}`);
  cat.used = true;
  if (!/^sec-risks-[a-z]+$/.test(cat.section.id)) fail(`risks/${slug}: bad section id ${cat.section.id}`);
  lint(cat.section.intro, `risks/${slug}.yaml#section.intro`);
  return `### ${escapeHtml(cat.section.title)} {#${cat.section.id}}\n\n${cat.section.intro}\n\n${genRiskTable(cat, slug)}`;
}

function genInfoDiv(info, ctx) {
  const parts = [];
  for (const block of info) {
    if (block.heading) parts.push(`${'#'.repeat(block.level)} ${escapeHtml(block.heading)}`);
    const lines = [];
    for (const e of block.entries ?? []) {
      if (e.text !== undefined) { lint(e.text, `${ctx}#info`); lines.push(e.text); }
      else if (e.allRisks) lines.push(`${e.bullet} All risks`);
      else if (e.risks) {
        for (const id of e.risks) if (!riskIds.has(id)) fail(`${ctx}: dangling risk ref ${id}`);
        lines.push(`${e.bullet} ${e.risks.map((id) => `[${id}](#${riskAnchor(id)})`).join(', ')}`);
      } else if (e.external) {
        if (!/^\w+$/.test(e.external.standard)) fail(`${ctx}: bad external standard ${e.external.standard}`);
        lines.push(`${e.bullet} [[?${e.external.standard}]] ${escapeHtml(e.external.ref)}`);
      } else throw new Error(`unknown info entry in ${ctx}: ${JSON.stringify(e)}`);
    }
    if (lines.length) parts.push(lines.join('\n'));
  }
  return `<div class="info">\n\n${parts.join('\n\n')}\n</div>`;
}

function genControlsSection(slug) {
  const sec = ctrlSecs.get(slug);
  if (!sec) throw new Error(`unknown controls section: ${slug}`);
  sec.used = true;
  if (!/^sec-controls-[a-z-]+$/.test(sec.section.id)) fail(`controls/${slug}: bad section id ${sec.section.id}`);
  const parts = [`### ${escapeHtml(sec.section.title)} {#${sec.section.id}}`];
  if (sec.section.intro) { lint(sec.section.intro, `controls/${slug}.yaml#section.intro`); parts.push(sec.section.intro); }
  for (const c of sec.controls) {
    if (c.headingId && !/^[a-z][a-z0-9-]*$/.test(c.headingId)) fail(`controls/${slug}: bad headingId ${c.headingId}`);
    parts.push(`#### ${escapeHtml(c.title)}${c.headingId ? ` {#${c.headingId}}` : ''}`);
    if (c.intro) { lint(c.intro, `controls/${slug}.yaml#${c.title}.intro`); parts.push(c.intro); }
    let pending = '';
    for (const req of c.requirements) {
      const stmt = req.statementRaw ?? req.statement;
      pending += `<a href="#${req.id}">🔗</a> <b id="${req.id}">${escapeHtml(stmt)}</b>`;
      if (req.joinNext !== undefined) { pending += req.joinNext; continue; }
      parts.push(pending);
      pending = '';
      if (req.after) { lint(req.after, `controls/${slug}.yaml#${req.id}.after`); parts.push(req.after); }
    }
    if (pending) parts.push(pending);
    parts.push(genInfoDiv(c.info, `controls/${slug}.yaml#${c.title}`));
    if (c.after) { lint(c.after, `controls/${slug}.yaml#${c.title}.after`); parts.push(c.after); }
  }
  return parts.join('\n\n');
}

function genMitigation(id) {
  const mit = mitigations.get(id);
  if (!mit) throw new Error(`unknown mitigation: ${id}`);
  mit.used = true;
  return `#### ${escapeHtml(mit.title)} {#${mit.id}}\n\n${mit.body}`;
}

// ── document flow ───────────────────────────────────────────────────────────
const flowFiles = readdirSync(join(ROOT, 'templates/flow')).filter((f) => f.endsWith('.md')).sort();
const directiveRe = /^<!-- @([\w-]+) ([\w-]+) -->$/;
const generators = {
  'risk-category': genRiskCategory,
  'controls-section': genControlsSection,
  mitigation: genMitigation,
};
const bodyParts = [];
for (const f of flowFiles) {
  const src = read(`templates/flow/${f}`);
  // defense in depth: flow files are maintainer surface but linted anyway,
  // minus their legitimately structural constructs (directive comments,
  // section wrappers, the abstract's literal <h2>)
  const structural = src
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\/?section[^>]*>/g, '')
    .replace(/<\/?h2>/g, '');
  lint(structural, `templates/flow/${f}`);
  const expanded = src
    .split('\n')
    .map((line) => {
      const m = directiveRe.exec(line.trim());
      if (!m) return line;
      const gen = generators[m[1]];
      if (!gen) throw new Error(`unknown directive @${m[1]} in ${f}`);
      return gen(m[2]);
    })
    .join('\n');
  bodyParts.push(expanded.trim());
}

// ── skeleton + publishDate ──────────────────────────────────────────────────
const head = read('templates/head.html');
let tail = read('templates/tail.html');

// publishDate: last commit date of the spec sources; keeps renders reproducible
// per commit instead of varying with file mtimes. Falls back to today.
let publishDate;
try {
  publishDate = execSync('git log -1 --format=%cs -- risks controls mitigations templates scripts', {
    encoding: 'utf8',
  }).trim();
} catch {
  /* not a git checkout */
}
if (!publishDate) publishDate = new Date().toISOString().slice(0, 10);
if (!tail.includes('publishDate:')) {
  tail = tail.replace(/(\n\s*var respecConfig = \{)/, `$1\n    publishDate: "${publishDate}",`);
}

const doc = `${head.trimEnd()}\n\n${bodyParts.join('\n\n\n')}\n\n\n${tail.trimEnd()}\n`;

// ── whole-document validation ───────────────────────────────────────────────
{
  // global id uniqueness: id attributes and {#...} markdown ids together
  // (anchor hijacking: a duplicate id placed earlier in the document steals
  // every deep link to the original)
  const seen = new Map();
  const bodyEnd = doc.indexOf('<script class="remove">'); // script code mentions id strings
  const bodyText = doc.slice(0, bodyEnd);
  for (const m of bodyText.matchAll(/(?: id="([\w-]+)")|(?:\{#([\w-]+)\})/g)) {
    const id = m[1] ?? m[2];
    const line = bodyText.slice(0, m.index).split('\n').length;
    if (seen.has(id)) fail(`duplicate element id '${id}' (lines ${seen.get(id)} and ${line})`);
    seen.set(id, line);
  }
  // risk references resolve, labels match anchors (supersedes validate-risk-refs)
  const defined = new Set([...doc.matchAll(/id="(risk-[a-z]+-\d+)"/g)].map((m) => m[1]));
  for (const [i, line] of doc.split('\n').entries()) {
    for (const m of line.matchAll(/\[([A-Z]+\d*)\]\(#risk-([a-z]+)-(\d+)\)/g)) {
      const expected = `${m[2].toUpperCase()}${m[3]}`;
      if (m[1] !== expected) fail(`line ${i + 1}: label mismatch [${m[1]}](#risk-${m[2]}-${m[3]})`);
    }
    for (const m of line.matchAll(/#(risk-[a-z]+-\d+)/g))
      if (!defined.has(m[1])) fail(`line ${i + 1}: dangling risk reference #${m[1]}`);
  }
  // mitigation frontmatter refs
  for (const [id, mit] of mitigations)
    for (const r of mit.risks ?? []) {
      if (r === 'all') continue;
      if (typeof r === 'object' && r.section) {
        if (![...riskCats.values()].some((c) => c.section.id === r.section))
          fail(`${id}: unknown section ref ${r.section}`);
      } else if (!riskIds.has(r)) fail(`${id}: dangling risk ref ${r}`);
    }
  // every source file must be used by the flow
  for (const [slug, cat] of riskCats) if (!cat.used) fail(`risks/${slug}.yaml not referenced by any directive`);
  for (const [slug, sec] of ctrlSecs) if (!sec.used) fail(`controls/${slug}.yaml not referenced by any directive`);
  for (const [id, mit] of mitigations) if (!mit.used) fail(`mitigations/${mit.file} (${id}) not referenced`);
}

if (errors.length) {
  for (const e of errors) console.error(`ERROR: ${e}`);
  console.error(`\nFAILED: ${errors.length} validation error(s)`);
  process.exit(1);
}

// ── dataset export (dist/valos.json, experimental) ──────────────────────────
export function buildDataset() {
  const mitList = [...mitigations.values()].map((m) => ({
    id: m.id,
    title: m.title,
    links: (m.risks ?? []).map((r) =>
      r === 'all'
        ? { rel: 'mitigates', scope: 'all-risks' }
        : typeof r === 'object'
          ? { rel: 'mitigates', scope: 'category', href: `#${r.section}` }
          : { rel: 'mitigates', riskId: r, href: `#${riskAnchor(r)}` },
    ),
  }));
  const riskList = [];
  for (const [, cat] of riskCats)
    for (const r of cat.risks)
      riskList.push({
        id: r.id,
        href: `#${riskAnchor(r.id)}`,
        category: cat.section.id,
        ...(r.retired
          ? { retired: r.retired === 'removed' ? { removed: true } : r.retired }
          : { group: r.group, vector: r.vector, description: r.description }),
        ...(r.replaces ? { replaces: r.replaces } : {}),
      });
  const ctrlList = [];
  for (const [, sec] of ctrlSecs)
    for (const c of sec.controls) {
      const links = [];
      for (const block of c.info)
        for (const e of block.entries ?? []) {
          if (e.risks) for (const id of e.risks) links.push({ rel: 'addresses', riskId: id, href: `#${riskAnchor(id)}` });
          if (e.allRisks) links.push({ rel: 'addresses', scope: 'all-risks' });
          if (e.external) links.push({ rel: 'maps-to', standard: e.external.standard, control: e.external.ref });
        }
      for (const req of c.requirements)
        ctrlList.push({
          id: req.id,
          href: `#${req.id}`,
          section: sec.section.id,
          title: c.title,
          statement: req.statement,
          links,
        });
    }
  return {
    $schema: 'experimental — structure may change without notice',
    source: 'https://lidofinance.github.io/valos/valos-spec.html',
    publishDate,
    risks: riskList,
    mitigations: mitList,
    controls: ctrlList,
  };
}

writeFileSync(join(ROOT, 'valos-spec.html'), doc);
console.log(
  `[assemble] valos-spec.html: ${riskIds.size} risks, ${mitigations.size} mitigations, ${reqIds.size} requirements (publishDate ${publishDate})`,
);
