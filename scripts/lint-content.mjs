// Content linter for contributor-editable sources (mitigations/, rich YAML
// fields in risks/ and controls/, and — defense in depth — templates/flow/).
//
// REJECT, NEVER REWRITE: any construct not explicitly allowed fails the
// build with file:line. The allowlist is frozen from the corpus at migration
// time; extending it is a reviewed change to this file.
//
// This is not an HTML sanitizer operating on hostile browser input — it is a
// fail-closed gate over a trusted *format*: anything ambiguous is an error,
// so parser-differential tricks buy an attacker a build failure, not a bypass.

// ── frozen allowlist ─────────────────────────────────────────────────────────
export const ALLOWED_TAGS = new Set([
  'div', 'details', 'summary', 'ul', 'ol', 'li', 'a', 'dfn', 'abbr', 'code',
  'pre', 'em', 'strong', 'b', 'i', 'br', 'p',
]);
// per-tag allowed attributes; tags not listed allow none
export const ALLOWED_ATTRS = {
  div: { class: new Set(['info', 'tools']) },
  details: { class: new Set(['tools']) },
  a: { href: 'url' },
  dfn: { id: 'id' }, // definition anchors; global uniqueness enforced in assemble
};
// https, fragment, or a same-origin relative path
const urlAllowed = (u) => {
  if (/^https:\/\/[^\s]+$/.test(u)) return true;
  if (/^#[\w.-]+$/.test(u)) return true;
  // relative path: charset excludes ':' (schemes) and a leading '/' ;
  // '..' traversal excluded explicitly
  return /^(\.\/)?[\w][\w./-]*$/.test(u) && !u.includes('..');
};
const URL_RULE_MSG = 'https://, #fragment, or relative path only';

const TAG_RE = /<[^>]*>|<|>/g; // every tag-ish region, plus stray angle brackets

export function lintText(text, file) {
  const errors = [];
  const err = (idx, msg) => {
    const line = text.slice(0, idx).split('\n').length;
    errors.push(`${file}:${line}: ${msg}`);
  };

  // fenced/inline code spans are literal text for markdown — exclude them
  // from tag scanning by blanking, preserving offsets
  const masked = text
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));

  // ── HTML tags ──────────────────────────────────────────────────────────────
  for (const m of masked.matchAll(TAG_RE)) {
    const raw = m[0];
    if (raw === '>') continue; // bare '>' (e.g. blockquote/arrows) is inert
    if (raw === '<') { err(m.index, `stray '<' (unterminated tag?)`); continue; }
    const tag = /^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([\s\S]*?)(\/?)>$/.exec(raw);
    if (!tag) {
      if (/^<!--[\s\S]*-->$/.test(raw)) {
        if (/@[\w-]+/.test(raw)) err(m.index, `directive-shaped comment not allowed in content: ${raw.slice(0, 60)}`);
        continue;
      }
      err(m.index, `unparseable tag: ${raw.slice(0, 60)}`);
      continue;
    }
    const [, closing, nameRaw, attrText] = tag;
    const name = nameRaw.toLowerCase();
    if (!ALLOWED_TAGS.has(name)) { err(m.index, `tag not allowed: <${closing}${name}>`); continue; }
    if (closing) {
      if (attrText.trim()) err(m.index, `attributes on closing tag: ${raw.slice(0, 60)}`);
      continue;
    }
    // attributes
    const allowed = ALLOWED_ATTRS[name] ?? {};
    const attrRe = /([a-zA-Z-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|[^\s>]+))?/g;
    for (const a of attrText.matchAll(attrRe)) {
      const attr = a[1].toLowerCase();
      const value = a[3] ?? a[4];
      const rule = allowed[attr];
      if (!rule) { err(m.index, `attribute not allowed on <${name}>: ${attr}`); continue; }
      if (value === undefined) { err(m.index, `attribute ${attr} on <${name}> must use a double-quoted value`); continue; }
      if (/[<>]/.test(value)) { err(m.index, `angle brackets in attribute value: ${value.slice(0, 60)}`); continue; }
      if (rule === 'url') {
        if (!urlAllowed(value)) err(m.index, `URL not allowed (${URL_RULE_MSG}): ${value.slice(0, 80)}`);
      } else if (rule === 'id') {
        if (!/^[a-z][a-z0-9-]*$/.test(value)) err(m.index, `bad id value: ${value.slice(0, 60)}`);
      } else if (rule instanceof Set) {
        if (!rule.has(value)) err(m.index, `value not allowed for ${attr} on <${name}>: ${value}`);
      }
    }
  }

  // ── markdown link destinations (both [t](url) and ![t](url)) ─────────────
  for (const m of masked.matchAll(/(!?)\[[^\]]*\]\(([^)\s]+)(?:\s[^)]*)?\)/g)) {
    if (m[1] === '!') { err(m.index, `images are not allowed in content: ${m[0].slice(0, 60)}`); continue; }
    const url = m[2];
    if (/^\[\[/.test(m[0])) continue; // [[?ref]] biblio syntax has no URL
    if (!urlAllowed(url)) err(m.index, `markdown link URL not allowed (${URL_RULE_MSG}): ${url.slice(0, 80)}`);
  }

  // ── explicit heading ids: charset only (global uniqueness checked in assemble)
  for (const m of masked.matchAll(/\{#([^}]*)\}/g)) {
    if (!/^[a-z][a-z0-9-]*$/.test(m[1])) err(m.index, `bad heading id: {#${m[1]}}`);
  }

  return errors;
}

// ── report mode: inventory of constructs, for freezing the allowlist ────────
export function reportText(text, acc) {
  const masked = text
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/`[^`\n]*`/g, (m) => ' '.repeat(m.length));
  for (const m of masked.matchAll(/<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g)) {
    if (m[1]) continue;
    const name = m[2].toLowerCase();
    acc.tags.set(name, (acc.tags.get(name) ?? 0) + 1);
    for (const a of m[3].matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g))
      acc.attrs.add(`${name}[${a[1]}="${a[2].length > 40 ? a[2].slice(0, 40) + '…' : a[2]}"]`);
  }
  for (const m of masked.matchAll(/!?\[[^\]]*\]\(([^)\s]+)(?:\s[^)]*)?\)/g)) {
    const scheme = /^([a-z+]+:|#|\/|\.)/.exec(m[1]);
    acc.urls.add(scheme ? scheme[1] : m[1].slice(0, 20));
    if (!/^(https:|#)/.test(m[1])) acc.oddUrls.add(m[1].slice(0, 90));
  }
}
