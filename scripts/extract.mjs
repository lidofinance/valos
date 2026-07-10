#!/usr/bin/env node
// One-time migration script (issue: separate data from code).
// Parses valos-spec.html into structured sources:
//   risks/<category>.yaml        risk tables
//   controls/<section>.yaml      controls catalog sections
//   mitigations/<slug>.md        mitigation sections (frontmatter + verbatim body)
//   templates/flow/NN-<name>.md  ordered document skeleton with @directives
//   templates/head.html, tail.html
//
// Anchor freeze: headings without an explicit {#id} whose rendered id embeds a
// section number (/^x\d/) get that id written explicitly, so future
// renumbering cannot silently change published anchors. The rendered ids are
// taken from a baseline render passed as argv[2].
//
// Usage: node scripts/extract.mjs <baseline-render.html>

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as YAML from 'yaml';

const ROOT = process.cwd();
const SRC = readFileSync(join(ROOT, 'valos-spec.html'), 'utf8').replace(/\r\n/g, '\n');
const baselinePath = process.argv[2];
if (!baselinePath) {
  console.error('Usage: node scripts/extract.mjs <baseline-render.html>');
  process.exit(1);
}
const BASELINE = readFileSync(baselinePath, 'utf8').replace(/\r\n/g, '\n');

const lines = SRC.split('\n');
const findLine = (pattern) => {
  const idx = lines.findIndex((l) => l.startsWith(pattern));
  if (idx === -1) throw new Error(`marker not found: ${pattern}`);
  return idx;
};

// ── anchor-freeze map from the baseline render ──────────────────────────────
// Map normalized heading text -> FIFO queue of rendered x-ids.
const freezeMap = new Map();
{
  const headingRe = /<h([2-6])[^>]*\bid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  for (const m of BASELINE.matchAll(headingRe)) {
    const [, , id, inner] = m;
    if (!/^x\d/.test(id)) continue;
    const text = inner
      .replace(/<[^>]+>/g, '')
      .replace(/^[\d.\s]+/, '')
      .replace(/\s+/g, ' ')
      .trim();
    if (!freezeMap.has(text)) freezeMap.set(text, []);
    freezeMap.get(text).push(id);
  }
}
let frozenCount = 0;
const freezeHeading = (line) => {
  const m = /^(#{2,6}) (.*?)\s*$/.exec(line);
  if (!m || /\{#[\w-]+\}$/.test(line)) return line;
  const text = m[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const queue = freezeMap.get(text);
  if (!queue || queue.length === 0) return line; // title-derived id, regenerates stably
  frozenCount++;
  return `${m[1]} ${m[2].trim()} {#${queue.shift()}}`;
};
const freezeBlock = (text) =>
  text
    .split('\n')
    .map((l) => (l.startsWith('#') ? freezeHeading(l) : l))
    .join('\n');

// ── helpers ─────────────────────────────────────────────────────────────────
const RISK_REF = /^\[([A-Z]+\d+)\]\(#risk-([a-z]+-\d+)\)$/;
const riskAnchor = (id) => {
  const m = /^([A-Z]+)(\d+)$/.exec(id);
  return `risk-${m[1].toLowerCase()}-${m[2]}`;
};

// Retired rows carry no free HTML in the data: parse the three phrasings into
// structure; the generator reproduces the exact wording from validated ids.
function parseRetired(text, riskId) {
  if (text === 'Removed') return 'removed';
  const linkList = (s) => {
    const links = [...s.matchAll(/<a href="#risk-([a-z]+)-(\d+)">([A-Z]+\d+)<\/a>/g)];
    const rebuilt = links.map((l) => `<a href="#risk-${l[1]}-${l[2]}">${l[3]}</a>`).join(', ');
    return { ids: links.map((l) => l[3]), rebuilt };
  };
  let m = /^Replaced by (.+)$/.exec(text);
  if (m) {
    const { ids, rebuilt } = linkList(m[1]);
    if (!ids.length || `Replaced by ${rebuilt}` !== text)
      throw new Error(`unparseable retired cell for ${riskId}: ${text}`);
    return { replacedBy: ids };
  }
  m = /^This risk has been merged into (.+)$/.exec(text);
  if (m) {
    const { ids, rebuilt } = linkList(m[1]);
    if (ids.length !== 1 || `This risk has been merged into ${rebuilt}` !== text)
      throw new Error(`unparseable retired cell for ${riskId}: ${text}`);
    return { mergedInto: ids[0] };
  }
  throw new Error(`unknown retired phrasing for ${riskId}: ${text}`);
}

// Table headers vary only in column labels/widths — no free HTML in the data.
function parseThead(thead, slug) {
  const cols = [...thead.matchAll(/<th(?: width="(\d+%)")?>([^<]+)<\/th>/g)].map((m) => ({
    label: m[2],
    ...(m[1] ? { width: m[1] } : {}),
  }));
  const rebuilt = `<thead>\n<tr>\n${cols
    .map((c) => `<th${c.width ? ` width="${c.width}"` : ''}>${c.label}</th>`)
    .join('\n')}\n</tr></thead>`;
  const norm = (s) => s.replace(/^\s+/gm, '');
  if (norm(rebuilt) !== norm(thead)) throw new Error(`thead does not round-trip in ${slug}:\n${thead}`);
  return cols;
}

// Parse an info-div bullet line into a structured entry, with a verbatim
// fallback: if the structure does not reconstruct the exact line, keep raw.
function parseInfoLine(line) {
  const bullet = /^([*-]) (.*)$/.exec(line);
  if (!bullet) return { text: line };
  const [, char, rest] = bullet;
  // risk reference group: "[FIN1](#risk-fin-1), [FIN2](#risk-fin-2)"
  const parts = rest.split(', ');
  if (parts.every((p) => RISK_REF.test(p))) {
    const ids = parts.map((p) => RISK_REF.exec(p)[1]);
    const rebuilt = `${char} ${ids.map((id) => `[${id}](#${riskAnchor(id)})`).join(', ')}`;
    if (rebuilt === line) return { risks: ids, bullet: char };
  }
  // external control reference: "[[?SOC2]] CC 5.2"
  const ext = /^\[\[\?(\w+)\]\] (.+)$/.exec(rest);
  if (ext) return { external: { standard: ext[1], ref: ext[2] }, bullet: char };
  if (rest === 'All risks') return { allRisks: true, bullet: char };
  return { text: line };
}

// Parse a <div class="info"> block body (between the div tags) into blocks of
// {heading, entries}. Content that fits no pattern is kept as {text} entries.
function parseInfoDiv(bodyLines) {
  const blocks = [];
  let current = null;
  for (const raw of bodyLines) {
    const line = raw.trimEnd();
    if (line === '') continue;
    const h = /^(#{4,6}) (.*)$/.exec(line);
    if (h) {
      current = { heading: h[2], level: h[1].length, entries: [] };
      blocks.push(current);
      continue;
    }
    if (!current) {
      current = { entries: [] };
      blocks.push(current);
    }
    current.entries.push(parseInfoLine(line));
  }
  return blocks;
}

// Extract risk metadata (for frontmatter / dataset) from a mitigation body's
// info div without altering the body itself.
function mitigationRisks(body) {
  const m = /<div class="info">([\s\S]*?)<\/div>/.exec(body);
  if (!m) return { risks: [], note: 'no info div' };
  const risks = [];
  for (const raw of m[1].split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const entry = parseInfoLine(line);
    if (entry.allRisks) risks.push('all');
    else if (entry.risks) risks.push(...entry.risks);
    else {
      // section-level reference, e.g. "[Slashing risks](#sec-risks-slashing)"
      const sec = [...line.matchAll(/\(#(sec-risks-[a-z-]+)\)/g)].map((x) => x[1]);
      if (sec.length) risks.push(...sec.map((s) => ({ section: s })));
    }
  }
  return { risks };
}

// ── locate the top-level regions ────────────────────────────────────────────
const iRisks = findLine('## Risks {#sec-risks}');
const iMits = findLine('## Risk Mitigation Strategies {#sec-mitigation}');
const iControls = findLine('## Controls Catalog {#sec-controls-catalog}');
const iSotd = findLine('<section id="sec-sotd"');
const iScript = findLine('<script class="remove">');
const iBody = findLine('  <body>');

const region = (a, b) => lines.slice(a, b).join('\n');

// ── output tree ─────────────────────────────────────────────────────────────
for (const d of ['risks', 'controls', 'mitigations', 'templates/flow'])
  mkdirSync(join(ROOT, d), { recursive: true });

const yamlOpts = { lineWidth: 100, blockQuote: 'folded' };
function writeYaml(rel, obj) {
  const text = YAML.stringify(obj, yamlOpts);
  // round-trip safety: what we wrote must parse back to what we meant
  const back = YAML.parse(text);
  if (JSON.stringify(back) !== JSON.stringify(obj))
    throw new Error(`YAML round-trip mismatch for ${rel}`);
  writeFileSync(join(ROOT, rel), text);
  console.log(`  ${rel}`);
}
const writeText = (rel, text) => {
  writeFileSync(join(ROOT, rel), text.endsWith('\n') ? text : text + '\n');
  console.log(`  ${rel}`);
};

// ── templates ───────────────────────────────────────────────────────────────
// (The autofill selector needs no transform: the stray mitigation id prefixes
// were renamed to sec-mit-* upstream in lidofinance/valos#167.)
writeText('templates/head.html', region(0, iBody + 1));
writeText('templates/tail.html', region(iScript, lines.length));

// ── risks ───────────────────────────────────────────────────────────────────
console.log('risks:');
const riskCatRe = /^### (.+?) \{#sec-risks-([a-z]+)\}$/;
const riskCatLines = [];
for (let i = iRisks; i < iMits; i++) if (riskCatRe.test(lines[i])) riskCatLines.push(i);
if (riskCatLines.length !== 8) throw new Error(`expected 8 risk categories, got ${riskCatLines.length}`);

let riskFlow = region(iRisks, riskCatLines[0]).trimEnd() + '\n';
let totalRisks = 0;
for (let c = 0; c < riskCatLines.length; c++) {
  const start = riskCatLines[c];
  const end = c + 1 < riskCatLines.length ? riskCatLines[c + 1] : iMits;
  const [, title, slug] = riskCatRe.exec(lines[start]);
  const block = region(start, end);
  const tableStart = block.indexOf('<table>');
  const tableEnd = block.indexOf('</table>');
  if (tableStart === -1 || tableEnd === -1) throw new Error(`no table in ${slug}`);
  const intro = block.slice(lines[start].length, tableStart).trim();
  const after = block.slice(tableEnd + '</table>'.length).trim();
  if (after) throw new Error(`unexpected content after table in ${slug}: ${after.slice(0, 80)}`);
  // column widths vary between tables — keep the header row verbatim
  const theadMatch = /<thead>[\s\S]*?<\/thead>/.exec(block);
  if (!theadMatch) throw new Error(`no thead in ${slug}`);
  const thead = theadMatch[0];
  // last row of a table may omit </tr> (HTML auto-close), so split on row starts
  const rowBlocks = [...block.slice(tableStart, tableEnd).matchAll(
    /<tr id="(risk-[a-z]+-\d+)">([\s\S]*?)(?=<tr[ >]|<\/tbody>|$)/g,
  )].map((m) => [m[0], m[1], m[2].replace(/<\/tr>\s*$/, '')]);
  const fullRe = /^\s*<td>([A-Z]+\d+)(?: \(replaces ([A-Z0-9, ]+)\))?<\/td>\s*<td>(.*?)<\/td>\s*<td>(.*?)<\/td>\s*<td>([\s\S]*?)<\/td>\s*<td><ul class="autofill-mits"><\/ul><\/td>\s*$/;
  const retiredRe = /^\s*<td>([A-Z]+\d+)<\/td>\s*<td colspan="4">([\s\S]*?)<\/td>\s*$/;
  const risks = rowBlocks.map(([, anchor, cells]) => {
    let m = fullRe.exec(cells);
    if (m) {
      const [, label, replaces, group, vector, description] = m;
      if (riskAnchor(label) !== anchor) throw new Error(`label/anchor mismatch: ${label} vs ${anchor}`);
      return {
        id: label,
        ...(replaces ? { replaces: replaces.split(', ') } : {}),
        group,
        vector,
        description: description.replace(/\s+/g, ' ').trim(),
      };
    }
    m = retiredRe.exec(cells);
    if (m) {
      if (riskAnchor(m[1]) !== anchor) throw new Error(`label/anchor mismatch: ${m[1]} vs ${anchor}`);
      return { id: m[1], retired: parseRetired(m[2].trim(), m[1]) };
    }
    throw new Error(`unparseable row ${anchor}: ${cells.slice(0, 100)}`);
  });
  // every <tr in the table block must have been captured
  const trCount = (block.slice(tableStart, tableEnd).match(/<tr id=/g) || []).length;
  if (trCount !== risks.length) throw new Error(`row parse loss in ${slug}: ${risks.length}/${trCount}`);
  totalRisks += risks.length;
  writeYaml(`risks/${slug}.yaml`, {
    section: { id: `sec-risks-${slug}`, title, intro },
    columns: parseThead(thead, slug),
    risks,
  });
  riskFlow += `\n<!-- @risk-category ${slug} -->\n`;
}
if (totalRisks !== 96) throw new Error(`expected 96 risks, got ${totalRisks}`);
writeText('templates/flow/02-risks.md', riskFlow);

// ── mitigations ─────────────────────────────────────────────────────────────
console.log('mitigations:');
const mitHeadRe = /^#### (.+?)\s*\{#(sec-mit[\w-]*)\}$/;
let mitFlow = '';
let mitCount = 0;
const mitSlugs = new Set();
{
  const flowParts = [];
  let cursor = iMits;
  const mitLines = [];
  for (let i = iMits; i < iControls; i++) if (mitHeadRe.test(lines[i])) mitLines.push(i);
  for (let m = 0; m < mitLines.length; m++) {
    const start = mitLines[m];
    // group prose / flow between previous mitigation and this heading
    flowParts.push(freezeBlock(region(cursor, start).trimEnd()));
    const [, title, id] = mitHeadRe.exec(lines[start]);
    // body runs to the next #### or ### heading (or the controls catalog)
    let end = iControls;
    for (let i = start + 1; i < iControls; i++)
      if (/^#{3,4} /.test(lines[i])) { end = i; break; }
    const body = freezeBlock(region(start + 1, end).trim());
    const slug = id.replace(/^sec-mit(igating|igations)?-/, '');
    if (mitSlugs.has(slug)) throw new Error(`mitigation slug collision: ${slug}`);
    mitSlugs.add(slug);
    const meta = { id, title, ...mitigationRisks(body) };
    const fm = YAML.stringify(meta, yamlOpts);
    writeText(`mitigations/${slug}.md`, `---\n${fm}---\n${body}`);
    flowParts.push(`<!-- @mitigation ${id} -->`);
    mitCount++;
    cursor = end;
  }
  flowParts.push(freezeBlock(region(cursor, iControls).trimEnd()));
  mitFlow = flowParts.filter(Boolean).join('\n\n') + '\n';
}
if (mitCount !== 46) throw new Error(`expected 46 mitigations, got ${mitCount}`);
writeText('templates/flow/03-mitigations.md', mitFlow);

// ── controls ────────────────────────────────────────────────────────────────
console.log('controls:');
const ctrlSecRe = /^### (.+?) \{#(sec-controls-[\w-]+)\}$/;
const ctrlSecLines = [];
for (let i = iControls; i < iSotd; i++) if (ctrlSecRe.test(lines[i])) ctrlSecLines.push(i);
if (ctrlSecLines.length !== 10) throw new Error(`expected 10 control sections, got ${ctrlSecLines.length}`);

let ctrlFlow = region(iControls, ctrlSecLines[0]).trimEnd() + '\n';
let ctrlCount = 0;
for (let c = 0; c < ctrlSecLines.length; c++) {
  const start = ctrlSecLines[c];
  const end = c + 1 < ctrlSecLines.length ? ctrlSecLines[c + 1] : iSotd;
  const [, secTitle, secId] = ctrlSecRe.exec(lines[start]);
  const slug = secId.replace(/^sec-controls-/, '');
  // control blocks begin at each "#### " heading OUTSIDE info divs
  // (one section uses an h4 as an info-div heading)
  const heads = [];
  {
    let inInfo = false;
    for (let i = start + 1; i < end; i++) {
      if (lines[i].includes('<div class="info">')) inInfo = true;
      else if (inInfo && lines[i].includes('</div>')) inInfo = false;
      else if (!inInfo && /^#### /.test(lines[i])) heads.push(i);
    }
  }
  const intro = region(start + 1, heads.length ? heads[0] : end).trim();
  const controls = [];
  for (let k = 0; k < heads.length; k++) {
    const hStart = heads[k];
    const hEnd = k + 1 < heads.length ? heads[k + 1] : end;
    const headingLine = freezeHeading(lines[hStart]);
    const hm = /^#### (.+?)(?: \{#([\w-]+)\})?$/.exec(headingLine);
    const block = region(hStart + 1, hEnd);
    const infoStart = block.indexOf('<div class="info">');
    if (infoStart === -1) throw new Error(`no info div under ${secId}: ${lines[hStart]}`);
    const infoEnd = block.indexOf('\n</div>', infoStart);
    if (infoEnd === -1) throw new Error(`unterminated info div under ${secId}: ${lines[hStart]}`);
    const pre = block.slice(0, infoStart);
    // a block may contain several requirement statements with prose between
    const stmtRe = /<a href="#(req-[\w-]+)">🔗<\/a> <b id="(req-[\w-]+)">([\s\S]*?)<\/b>/g;
    const stmts = [...pre.matchAll(stmtRe)];
    if (!stmts.length) throw new Error(`no statement in control under ${secId}: ${lines[hStart]}`);
    const bIdCount = (pre.match(/<b id="req-/g) || []).length;
    if (bIdCount !== stmts.length) throw new Error(`statement parse loss under ${lines[hStart]}`);
    const requirements = stmts.map((s, i) => {
      if (s[1] !== s[2]) throw new Error(`self-link mismatch: ${s[1]} vs ${s[2]}`);
      const from = s.index + s[0].length;
      const to = i + 1 < stmts.length ? stmts[i + 1].index : pre.length;
      const betweenRaw = pre.slice(from, to);
      // two statements can share one line ("...</b>, <a...>and SHOULD ...");
      // a joiner (no newline before the next statement) must be preserved
      // inline or the paragraph structure (and the summary table) changes
      const joinsNext = i + 1 < stmts.length && !betweenRaw.includes('\n');
      const between = joinsNext ? '' : freezeBlock(betweenRaw.trim());
      ctrlCount++;
      return {
        id: s[1],
        statement: s[3].replace(/\s+/g, ' ').trim(),
        ...(s[3].includes('\n') ? { statementRaw: s[3] } : {}),
        ...(joinsNext ? { joinNext: betweenRaw } : {}),
        ...(between ? { after: between } : {}),
      };
    });
    const preIntro = freezeBlock(pre.slice(0, stmts[0].index).trim());
    const after = freezeBlock(block.slice(infoEnd + '\n</div>'.length).trim());
    const info = parseInfoDiv(block.slice(infoStart + '<div class="info">'.length, infoEnd).split('\n'));
    controls.push({
      title: hm[1],
      ...(hm[2] ? { headingId: hm[2] } : {}),
      ...(preIntro ? { intro: preIntro } : {}),
      requirements,
      info,
      ...(after ? { after } : {}),
    });
  }
  writeYaml(`controls/${slug}.yaml`, {
    section: { id: secId, title: secTitle, ...(intro ? { intro: freezeBlock(intro) } : {}) },
    controls,
  });
  ctrlFlow += `\n<!-- @controls-section ${slug} -->\n`;
}
if (ctrlCount !== 64) throw new Error(`expected 64 controls, got ${ctrlCount}`);
writeText('templates/flow/04-controls.md', ctrlFlow);

// ── front matter and appendices ─────────────────────────────────────────────
writeText('templates/flow/01-front.md', freezeBlock(region(iBody + 1, iRisks).trim()));
writeText('templates/flow/05-appendices.md', freezeBlock(region(iSotd, iScript).trim()));

// ── report ──────────────────────────────────────────────────────────────────
const unconsumed = [...freezeMap.entries()].filter(([, q]) => q.length);
console.log(`\nrisks: ${totalRisks}, mitigations: ${mitCount}, controls: ${ctrlCount}`);
console.log(`frozen anchors: ${frozenCount}`);
if (unconsumed.length) {
  console.log(`WARNING: ${unconsumed.length} x-ids not consumed:`);
  for (const [text, q] of unconsumed) console.log(`  "${text}" -> ${q.join(', ')}`);
}
