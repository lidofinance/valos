// Webflow landing page processor.
//
// Reads Webflow/index.html (a Webflow auto-export, treated as a build input),
// applies security transforms, and writes the result to dist/ along with the
// supporting assets (css/, js/, images/, documents/).
//
// Transforms applied:
//   1. FINDING-01 — add rel="noopener noreferrer" to every target="_blank"
//      anchor. Prevents tabnapping via window.opener on partner-organization
//      links.
//
// Webflow/index.html is never modified in place: re-exporting the landing
// page from Webflow will not clobber the security transforms applied here.

import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const WEBFLOW = join(ROOT, 'Webflow');

function log(msg) {
  process.stdout.write(`[webflow] ${msg}\n`);
}

export function processWebflow(dist) {
  let html = readFileSync(join(WEBFLOW, 'index.html'), 'utf8');

  // FINDING-01: rel="noopener noreferrer" on every target="_blank".
  // Pre-condition checked at audit time: no target="_blank" anchor in the
  // current export has a pre-existing rel= attribute, so a literal append is
  // safe. The replacement is also idempotent — re-running won't double up,
  // because the replaced string contains a rel= attribute that won't match
  // the regex's lookahead.
  const targetBlankRe = /target="_blank"(?!\s+rel=)/g;
  let count = 0;
  html = html.replace(targetBlankRe, () => {
    count++;
    return 'target="_blank" rel="noopener noreferrer"';
  });
  if (count === 0) {
    log(
      'WARNING: no target="_blank" anchors transformed. Webflow export may have changed; FINDING-01 control could be inert.',
    );
  } else {
    log(`added rel="noopener noreferrer" to ${count} anchor(s)`);
  }

  writeFileSync(join(dist, 'index.html'), html);

  // Copy supporting assets verbatim. Path layout in dist/ mirrors Webflow/.
  for (const dir of ['css', 'js', 'images', 'documents']) {
    cpSync(join(WEBFLOW, dir), join(dist, dir), { recursive: true });
  }
  log('copied css/, js/, images/, documents/ to dist/');
}
