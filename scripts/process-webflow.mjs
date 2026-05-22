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
//   2. FINDING-02 — replace external script/font CDN loads with locally
//      vendored copies and inject a hash-based Content-Security-Policy:
//        - Drop the Google Web Font Loader script + WebFont.load inline call;
//          the fonts are vendored under vendor/webflow/fonts/ and loaded via a static
//          fonts.css.
//        - Drop the fonts.googleapis.com / fonts.gstatic.com preconnect hints
//          (no longer needed; nothing on the page contacts those origins).
//        - Rewrite the jQuery CloudFront URL to the locally vendored copy
//          (preserve the SRI hash for defense-in-depth).
//        - Compute SHA-256 hashes of all remaining inline executable scripts
//          and write a hardened CSP <meta> into the head. script-src lists
//          only 'self' + the inline-script hashes; no external origins.
//
// Webflow/index.html is never modified in place: re-exporting the landing
// page from Webflow will not clobber the security transforms applied here.

import { cpSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const ROOT = process.cwd();
const WEBFLOW = join(ROOT, 'Webflow');
const VENDOR = join(ROOT, 'vendor', 'webflow');

const JQUERY_FILE = 'jquery-3.5.1.min.js';

function log(msg) {
  process.stdout.write(`[webflow] ${msg}\n`);
}

function hashInlineScripts(html) {
  // Match <script>...</script> blocks that have no src attribute and an
  // executable type (i.e. not application/json or application/ld+json).
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
  const hashes = [];
  for (const m of html.matchAll(scriptRe)) {
    const attrs = m[1];
    const body = m[2];
    if (/\bsrc\s*=/.test(attrs)) continue;
    if (/type\s*=\s*["']application\/(ld\+)?json["']/.test(attrs)) continue;
    if (body.trim() === '') continue;
    const digest = createHash('sha256').update(body, 'utf8').digest('base64');
    hashes.push(`'sha256-${digest}'`);
  }
  return hashes;
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
  let relCount = 0;
  html = html.replace(targetBlankRe, () => {
    relCount++;
    return 'target="_blank" rel="noopener noreferrer"';
  });
  if (relCount === 0) {
    log(
      'WARNING: no target="_blank" anchors transformed. Webflow export may have changed; FINDING-01 control could be inert.',
    );
  } else {
    log(`added rel="noopener noreferrer" to ${relCount} anchor(s)`);
  }

  // FINDING-02 (a): drop the Google Web Font Loader and the inline WebFont
  // call that depends on it. Fonts are vendored locally and applied via
  // fonts.css (linked below).
  const webfontLoaderRe =
    /\s*<script\s+src="https:\/\/ajax\.googleapis\.com\/ajax\/libs\/webfont\/[^"]+"[^>]*><\/script>/;
  const webfontLoadCallRe =
    /\s*<script\s+type="text\/javascript">WebFont\.load\([^<]*\);<\/script>/;
  const fontsPreconnectRe =
    /\s*<link\s+href="https:\/\/fonts\.(googleapis|gstatic)\.com"\s+rel="preconnect"(?:\s+crossorigin="anonymous")?>/g;
  if (!webfontLoaderRe.test(html) || !webfontLoadCallRe.test(html)) {
    throw new Error(
      'Expected to find webfont.js script + WebFont.load inline in Webflow/index.html — exported source may have changed.',
    );
  }
  html = html
    .replace(webfontLoaderRe, '')
    .replace(webfontLoadCallRe, '')
    .replace(fontsPreconnectRe, '');
  log('removed Google Web Font Loader, WebFont.load, fonts.* preconnects');

  // FINDING-02 (b): rewrite the jQuery <script> tag to load the locally
  // vendored copy. We replace the entire tag rather than just the URL: SRI
  // and crossorigin are meaningful when loading from a CDN, but on a
  // same-origin file they trigger CORS-mode fetching that fails on
  // file:// previews and is redundant (integrity is anchored in
  // vendor/CHECKSUMS.md, which the build verifies before render).
  const jqueryTagRe =
    /<script\s+src="https:\/\/d3e54v103j8qbb\.cloudfront\.net\/js\/jquery-3\.5\.1\.min\.dc5e7f18c8\.js\?site=[^"]+"[^>]*><\/script>/;
  if (!jqueryTagRe.test(html)) {
    throw new Error(
      'Expected to find jQuery CloudFront <script> tag in Webflow/index.html — exported source may have changed.',
    );
  }
  html = html.replace(
    jqueryTagRe,
    `<script src="./${JQUERY_FILE}" type="text/javascript"></script>`,
  );
  log(`rewrote jQuery <script> tag to ./${JQUERY_FILE}`);

  // FINDING-02 (c): inject the local fonts stylesheet link. Place it after
  // the last existing <link rel="stylesheet"> in <head> so cascade order
  // matches Webflow's expectation (Webflow CSS may set font-family rules
  // that need fonts.css to already be available).
  const lastStylesheetRe = /(<link[^>]*href="css\/valos\.webflow\.css"[^>]*>)/;
  if (!lastStylesheetRe.test(html)) {
    throw new Error(
      'Expected to find Webflow stylesheet link to insert fonts.css after.',
    );
  }
  html = html.replace(
    lastStylesheetRe,
    `$1\n  <link href="./fonts.css" rel="stylesheet" type="text/css">`,
  );
  log('inserted <link> to ./fonts.css');

  // FINDING-02 (d): compute SHA-256 of all remaining inline executable
  // scripts and inject a hardened CSP <meta> into <head>.
  const hashes = hashInlineScripts(html);
  const csp =
    `script-src 'self' ${hashes.join(' ')}; ` +
    `style-src 'self' 'unsafe-inline'; ` +
    `img-src 'self' data:; ` +
    `font-src 'self' data:; ` +
    `connect-src 'self'; ` +
    `frame-src 'none'; ` +
    `object-src 'none'; ` +
    `base-uri 'self'; ` +
    `form-action 'self'; ` +
    `default-src 'self';`;
  const cspMeta = `  <meta http-equiv="Content-Security-Policy" content="${csp}">\n`;
  // Insert immediately after the charset meta (Webflow's first <meta>).
  html = html.replace(
    /(<meta\s+charset="utf-8">)/,
    `$1\n${cspMeta.trimEnd()}`,
  );
  log(`injected CSP with ${hashes.length} inline-script hash(es)`);

  writeFileSync(join(dist, 'index.html'), html);

  // Copy Webflow-owned supporting assets verbatim. Path layout in dist/
  // mirrors Webflow/.
  for (const dir of ['css', 'js', 'images', 'documents']) {
    cpSync(join(WEBFLOW, dir), join(dist, dir), { recursive: true });
  }
  // Copy vendored Webflow dependencies to dist/.
  cpSync(join(VENDOR, JQUERY_FILE), join(dist, JQUERY_FILE));
  cpSync(join(VENDOR, 'fonts.css'), join(dist, 'fonts.css'));
  cpSync(join(VENDOR, 'fonts'), join(dist, 'fonts'), { recursive: true });
  log(`copied Webflow assets + vendored jquery/fonts into ${dist}`);
}
