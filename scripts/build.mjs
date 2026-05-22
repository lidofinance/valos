#!/usr/bin/env node
// Build script: produce a static, self-contained dist/ for GitHub Pages.
//
// Steps:
//   1. Render valos-spec.html via the ReSpec CLI (headless Chrome) into dist/
//   2. Rewrite W3C CDN references (fixup.js, base.css) to local paths
//   3. Compute SHA-256 hashes of inline executable scripts; replace the source
//      CSP meta tag with a hardened, hash-based CSP (no 'unsafe-inline' on
//      script-src)
//   4. Copy vendored assets (vendor/) and deploy assets (LICENSE, assets/)
//      into dist/
//
// The dist/ output is what GitHub Pages serves. It contains no external
// runtime dependencies.

import { execSync } from 'node:child_process';
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { processWebflow } from './process-webflow.mjs';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const VENDOR = join(ROOT, 'vendor');

const FIXUP_URL = 'https://www.w3.org/scripts/TR/2021/fixup.js';
const BASE_CSS_URL = 'https://www.w3.org/StyleSheets/TR/2021/base.css';

function log(msg) {
  process.stdout.write(`[build] ${msg}\n`);
}

// 1. Clean dist/
rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });

// 2. Render with ReSpec CLI. --localhost spins up a local HTTP server so the
//    source's relative paths (e.g. ./node_modules/respec/...) resolve.
log('rendering valos-spec.html via respec CLI');
// On Linux (incl. GitHub Actions ubuntu-latest), Ubuntu 24+ AppArmor blocks
// the unprivileged user namespace that Puppeteer's bundled Chromium needs to
// build its sandbox. We wrap respec under the system's existing `chrome`
// AppArmor profile (installed by the preinstalled google-chrome-stable
// package), which permits user namespaces — keeping Chrome's sandbox intact.
let aaExec = '';
if (process.platform === 'linux') {
  try {
    execSync('command -v aa-exec', { stdio: 'ignore', shell: '/bin/sh' });
    aaExec = 'aa-exec --profile=chrome ';
  } catch {
    log('aa-exec not found; running respec without AppArmor profile wrapper (Chrome sandbox may fail on Ubuntu 24+)');
  }
}
execSync(
  `${aaExec}npx respec --src=valos-spec.html --out=dist/valos-spec.html --localhost --haltonerror`,
  { stdio: 'inherit' },
);

const outPath = join(DIST, 'valos-spec.html');
let html = readFileSync(outPath, 'utf8');

// 3. Rewrite external W3C asset URLs to local paths.
const beforeFixup = html.includes(FIXUP_URL);
const beforeBase = html.includes(BASE_CSS_URL);
html = html.split(FIXUP_URL).join('./fixup.js');
html = html.split(BASE_CSS_URL).join('./base.css');
if (!beforeFixup) {
  throw new Error(
    `Expected to find ${FIXUP_URL} in rendered output; ReSpec may have changed its behavior.`,
  );
}
if (!beforeBase) {
  throw new Error(
    `Expected to find ${BASE_CSS_URL} in rendered output; ReSpec may have changed its behavior.`,
  );
}
log('rewrote W3C CDN refs to ./fixup.js and ./base.css');

// 4. Extract inline executable script blocks and compute SHA-256 hashes for
//    a hash-based CSP. Skip <script src="..."> (no inline body) and
//    type="application/json" / "application/ld+json" (data, not executable).
const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
const hashes = [];
let m;
while ((m = scriptRe.exec(html)) !== null) {
  const attrs = m[1];
  const body = m[2];
  if (/\bsrc\s*=/.test(attrs)) continue;
  if (/type\s*=\s*["']application\/(ld\+)?json["']/.test(attrs)) continue;
  if (body.trim() === '') continue;
  const digest = createHash('sha256').update(body, 'utf8').digest('base64');
  hashes.push(`'sha256-${digest}'`);
}
log(`hashed ${hashes.length} inline script block(s) for CSP`);

// 5. Build hardened CSP and swap in for the source CSP meta tag.
//    script-src: 'self' for ./fixup.js, hashes for inlines, no 'unsafe-inline'.
//    style-src:  'self' + 'unsafe-inline' (audit FINDING-05 was script-only;
//                style hashing is out of scope for this PR).
//    worker-src: 'self' blob: (ReSpec's highlighter worker uses a Blob URL).
const hardenedCsp =
  `script-src 'self' ${hashes.join(' ')}; ` +
  `style-src 'self' 'unsafe-inline'; ` +
  `worker-src 'self' blob:;`;

const cspMetaRe =
  /<meta\s+http-equiv="Content-Security-Policy"\s+content="[^"]*"\s*\/?>/;
if (!cspMetaRe.test(html)) {
  throw new Error(
    'Could not find Content-Security-Policy meta tag in rendered output.',
  );
}
html = html.replace(
  cspMetaRe,
  `<meta http-equiv="Content-Security-Policy" content="${hardenedCsp}">`,
);
log('replaced CSP meta tag with hash-based policy');

writeFileSync(outPath, html);

// 6. Copy vendored assets into dist/.
copyFileSync(join(VENDOR, 'fixup.js'), join(DIST, 'fixup.js'));
copyFileSync(join(VENDOR, 'base.css'), join(DIST, 'base.css'));

// 7. Copy deploy assets.
copyFileSync(join(ROOT, 'LICENSE'), join(DIST, 'LICENSE'));
cpSync(join(ROOT, 'assets'), join(DIST, 'assets'), { recursive: true });

// 8. Write dist/index.html as a redirect to the canonical spec URL so the
//    bare deploy URL (e.g. /valos/) does not 404 — and so the spec is the
//    only HTML in dist/ that GitHub Pages serves. The Webflow landing page
//    is built to dist-webflow/ (see step 9); it is intentionally not part
//    of this deploy artifact.
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>ValOS</title>
    <link rel="canonical" href="./valos-spec.html">
    <meta http-equiv="refresh" content="0; url=./valos-spec.html">
  </head>
  <body>
    <p>Redirecting to <a href="./valos-spec.html">valos-spec.html</a>.</p>
  </body>
</html>
`;
writeFileSync(join(DIST, 'index.html'), indexHtml);
log('wrote dist/index.html redirect to valos-spec.html');

// 9. Process Webflow landing page into a separate dist-webflow/ artifact.
//    This is built every time but is NOT shipped by .github/workflows/
//    deploy.yml — it exists so the hardened Webflow output can be
//    reviewed locally, and so a future workflow can deploy it elsewhere.
const DIST_WEBFLOW = join(ROOT, 'dist-webflow');
rmSync(DIST_WEBFLOW, { recursive: true, force: true });
mkdirSync(DIST_WEBFLOW, { recursive: true });
processWebflow(DIST_WEBFLOW);

log(`done. dist/ ready for deployment; dist-webflow/ built for review.`);
