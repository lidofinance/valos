# ValOS Security Audit Report

**Audit Date**: 2026-05-21  
**Audited by**: Claude (senior security engineer review)  
**Branch at audit time**: main (commit 35d0468)

---

## Executive Summary

**Repository**: `lidofinance/valos` — the Validator Operations Standard (ValOS), an open-source static documentation site and specification.

**Overall Risk Level**: **LOW**

This repository is a purely static documentation site with no server-side code, no database, no authentication system, and no user-generated content. The attack surface is narrow. The team has already applied meaningful supply-chain controls (vendoring dependencies, checksumming vendor files, implementing a CSP). Several lower-severity issues and improvement opportunities remain, documented below.

**No production blockers were identified. No hardcoded secrets or credentials were found.**

---

## Methodology

Files reviewed exhaustively: all HTML (`valos-spec.html`, `Webflow/index.html`), all JavaScript (`webflow.js`, all `vendor/*.js`), all CI/CD workflows (`.github/workflows/deploy.yml`, `validate-risk-refs.yml`), the shell validation script (`scripts/validate-risk-refs.sh`), `.gitignore`, `.claude/settings.local.json`, `vendor/CHECKSUMS.md`, `README.md`, `CONTRIBUTING.md`.

Grep patterns applied: `innerHTML`, `eval(`, `document.write`, `dangerouslySetInnerHTML`, `secret`, `password`, `token`, `api_key`, `http://` (non-HTTPS), `target="_blank"`, SRI attributes, CSP directives, shell injection patterns, temp file race conditions, GitHub Actions permissions.

Vendor file SHA-256 checksums were recomputed and compared against `CHECKSUMS.md` — all match.

---

## Findings by Severity

---

### High Priority Before Launch

#### FINDING-01: Missing `rel="noopener noreferrer"` on All External Links in Webflow/index.html ✅ Fixed

**Severity**: High priority before launch — **Resolved 2026-05-21**  
**File**: `Webflow/index.html` (all `target="_blank"` anchors — 33 links to external partner organizations)

**Description**: Every `target="_blank"` anchor in `Webflow/index.html` is missing `rel="noopener noreferrer"`. This covers all outbound links to Telegram, GitHub, and partner organization sites.

**Exploitation**: When a user clicks one of these links, the opened tab receives a reference to the opener window via `window.opener`. A malicious destination page (or one that is later compromised) can call `window.opener.location = "https://phishing-site.com"` to silently redirect the original ValOS page while the user is reading the new tab. This is the well-known tabnapping attack. Given that the ValOS landing page links to 33 external partner organizations, any one being compromised in the future creates an indirect attack path against ValOS visitors.

**Why it matters**: The ValOS landing page is an authoritative standard used by node operators managing validator keys and staking infrastructure. A tabnapping attack could redirect operators to a phishing page impersonating ValOS, potentially capturing credentials or convincing them to download malicious tooling.

**Implementation**: `scripts/process-webflow.mjs` runs at build time, reads `Webflow/index.html`, and appends `rel="noopener noreferrer"` to every `target="_blank"` anchor before writing `dist/index.html`. The transform is idempotent (regex lookahead prevents double-application) and logs the transformation count so a future Webflow re-export that changes HTML structure is visible in build logs. `Webflow/index.html` is treated as a build input and is never modified in place — re-exporting the landing page from Webflow does not lose the security transform.

---

#### FINDING-02: No Content Security Policy on Webflow/index.html ✅ Fixed

**Severity**: High priority before launch — **Resolved 2026-05-21**  
**File**: `Webflow/index.html` (transformed at build time by `scripts/process-webflow.mjs`)

**Description**: The Webflow landing page has no `Content-Security-Policy` meta tag or equivalent header. In contrast, `valos-spec.html` has a well-considered CSP. The Webflow page loads scripts from three external origins without policy enforcement:
- `https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js` (no SRI, no CSP)
- `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min...js` (SRI present, but no CSP fallback)
- Local `js/webflow.js` (no SRI)

**Exploitation**: If any of these external script sources is compromised (Google APIs CDN, Webflow's CloudFront distribution), an attacker can inject arbitrary JavaScript into every visitor's browser with no policy enforcement to block it. Since the Webflow page is the public-facing front door for the ValOS standard and links directly to community resources, a supply chain compromise would reach the entire ValOS audience.

**Why it matters**: XSS or CDN compromise on an unprotected page is the highest-impact web attack scenario for a static site. The Google Web Font loader (`webfont.js`) is loaded without SRI, meaning any modification to that file on Google's CDN would execute with full script privileges.

**Implementation**: Hardened end-to-end rather than just adding a permissive CSP. All external script and font loads were eliminated by vendoring the dependencies, then the CSP was tightened to forbid any external sources at all:

- **Google Web Font Loader removed**. `scripts/process-webflow.mjs` strips the `<script src="https://ajax.googleapis.com/.../webfont.js">` tag and the `WebFont.load({...})` inline call. This eliminates the un-SRI'd external script load described in FINDING-12.
- **Google Fonts vendored**. The two font families used by the design (DM Mono, Host Grotesk) were downloaded from Google Fonts to `vendor/fonts/` (8 woff2 files) and accompanied by a rewritten `vendor/fonts.css` with `@font-face` declarations pointing at relative paths. The build copies these into `dist/` and injects a `<link rel="stylesheet" href="./fonts.css">` into the rendered head. `fonts.googleapis.com` / `fonts.gstatic.com` are no longer contacted at runtime, and the preconnect hints to those origins are stripped.
- **jQuery vendored**. The CloudFront URL `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=...` is rewritten to `./jquery-3.5.1.min.js`. The vendored file at `vendor/jquery-3.5.1.min.js` was verified at vendor time to match the SRI hash already on the original tag (`sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=`); that hash is preserved on the rewritten tag as a defense-in-depth signal. Version 3.5.1 was retained (not bumped to 3.7.x) because Webflow's `webflow.js` runtime was built and tested against the 3.5 API; both relevant historical jQuery XSS CVEs (CVE-2020-11022, CVE-2020-11023) are fixed in 3.5.0 so 3.5.1 has no known unpatched vulnerabilities.
- **Hash-based CSP injected**. After the URL rewrites, `process-webflow.mjs` computes SHA-256 hashes of every remaining inline executable script (the touch-detection one-liner and the burger-menu handler) and writes a CSP `<meta>` immediately after the charset meta:
```
script-src 'self' 'sha256-…' 'sha256-…';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self';
frame-src 'none';
object-src 'none';
base-uri 'self';
form-action 'self';
default-src 'self';
```
The deployed page contacts zero external origins at runtime. `Webflow/index.html` itself is unchanged — the transforms run on each build, so a re-export from Webflow does not lose the hardening. This also resolves FINDING-12 (Google Web Font Loader SRI) by eliminating that external load entirely.

---

### Should Fix Soon

#### FINDING-03: GitHub Actions Workflow Lacks Explicit Permissions Block (validate-risk-refs.yml) ✅ Fixed

**Severity**: Should fix soon — **Resolved 2026-05-21**  
**File**: `.github/workflows/validate-risk-refs.yml`

**Description**: The `validate-risk-refs.yml` workflow has no `permissions:` block. If the organization's default token permissions are set to `read-write`, this workflow receives unnecessary write access when triggered on `pull_request` events. The workflow also executes `bash ./scripts/validate-risk-refs.sh` from checked-out PR code, meaning a PR author can modify this script to run arbitrary commands in CI.

**Exploitation**: An insider or approved contributor submitting a PR that modifies `validate-risk-refs.sh` can execute arbitrary code in the CI environment. Since no secrets are stored in CI for this workflow, impact is limited to the runner environment — but this could be leveraged for reconnaissance or lateral movement if the runner has network access to internal resources.

**Remediation**: Add a minimal permissions block:
```yaml
permissions:
  contents: read
  pull-requests: read
```
Also consider pinning the checkout action to a commit SHA rather than a mutable tag.

---

#### FINDING-04: GitHub Actions Not Pinned to Commit SHAs in deploy.yml — **Remediated**

**Original severity**: Should fix soon  
**Status**: Remediated (2026-05-21, commit `f2112ed`)  
**File**: `.github/workflows/deploy.yml`

**Original issue**: All four actions in the deploy workflow used mutable version tags (`@v4`, `@v5`, `@v3`). A tag compromise in the `actions/` organization could have caused the workflow to run malicious code with `id-token: write` and `pages: write`, affecting what is published to GitHub Pages.

**Resolution**: All deploy workflow actions are now pinned to immutable commit SHAs with inline version comments:

| Action | Pinned SHA | Version |
|---|---|---|
| `actions/checkout` | `11bd71901bbe5b1630ceea73d27597364c9af683` | v4.2.2 |
| `actions/configure-pages` | `983d7736d9b0ae728b81ab479565c72886d7745` | v5.0.0 |
| `actions/upload-pages-artifact` | `56afc609e74202658d3ffba0e8f6dda462b719fa` | v3.0.1 |
| `actions/deploy-pages` | `d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e` | v4.0.5 |

**Follow-up**: When upgrading actions, update both the SHA and the version comment together. Re-verify SHAs against the official release tags before merging.

---

#### FINDING-05: `unsafe-inline` in Content Security Policy (valos-spec.html) ✅ Fixed

**Severity**: Should fix soon — **Resolved 2026-05-21**  
**File**: `valos-spec.html`, line 5

**Description**: The CSP on `valos-spec.html` permits `'unsafe-inline'` in `script-src`:
```
script-src 'self' 'unsafe-inline' https://www.w3.org/scripts/;
```
`'unsafe-inline'` for `script-src` renders the CSP largely ineffective against XSS — any injected inline `<script>` tag would execute without restriction. The respec framework uses an inline `<script class="remove">` block which necessitated this inclusion.

**Context**: Since `valos-spec.html` has no user input paths, the actual XSS risk is low. An attacker would need repository write access to inject script content. This is a defense-in-depth weakness rather than a directly exploitable vulnerability in the current architecture.

**Implementation**: The deployment model was changed from runtime ReSpec (JS framework executed in the visitor's browser) to a build-time static-snapshot render via the ReSpec CLI (`npx respec --src=... --out=...`). The deployed `dist/valos-spec.html` is now static HTML with no runtime ReSpec — the inline scripts in the output (`respec-highlight-vars`, `respec-dfn-panel`) are deterministic, baked-in strings. `scripts/build.mjs` computes their SHA-256 hashes at build time and rewrites the CSP `<meta>` tag to use `'sha256-…'` hashes in place of `'unsafe-inline'`. The deployed `script-src` is `'self' 'sha256-…' 'sha256-…'`. The source `valos-spec.html` retains `'unsafe-inline'` only because runtime ReSpec preview during local development requires it; the build script replaces the meta tag before the artifact ships.

---

#### FINDING-06: `fixup.js` Loaded from W3C CDN Without SRI ✅ Fixed

**Severity**: Should fix soon — **Resolved 2026-05-21**  
**File**: previously `vendor/respec-w3c-35.6.1.js`, line 736 (no longer present after migration to build-time render)

**Description**: `respec-w3c-35.6.1.js` dynamically creates a `<script>` tag that loads `https://www.w3.org/scripts/TR/2021/fixup.js` at runtime without SRI. The `CHECKSUMS.md` notes this as a deliberate decision due to CORS limitations.

**Exploitation**: Any modification to `fixup.js` on W3C's server would be served and executed undetected. The spec page is a reference for node operators making security decisions — a compromised `fixup.js` could inject content or perform phishing within the spec page.

**Implementation**: `fixup.js` was downloaded from W3C and committed to `vendor/fixup.js` as a pre-patched source-of-truth file. The patch removes the `Deprecation warning` block (upstream lines 276–366), which made a runtime `XMLHttpRequest` to `https://www.w3.org/TR/tr-outdated-spec` — dead code on a non-W3C host but defensively removed; see [vendor/fixup.js.PATCH.md](../vendor/fixup.js.PATCH.md). `scripts/build.mjs` rewrites the W3C CDN URL in the rendered HTML to `./fixup.js` and copies `vendor/fixup.js` into `dist/`, so the deployed page serves the script from the same origin. No SRI/CORS gymnastics required. The deployed artifact makes zero runtime calls to `www.w3.org/scripts/` or `www.w3.org/StyleSheets/` — `base.css` is vendored alongside via the same mechanism.

---

#### FINDING-07: `api.specref.org` Runtime API Call — Privacy and Availability Dependency ✅ Fixed

**Severity**: Should fix soon — **Resolved 2026-05-21**  
**File**: `vendor/respec-w3c-35.6.1.js` (embedded respec behavior); `valos-spec.html` (`respecConfig`)

**Description**: When `valos-spec.html` renders, respec makes an outbound API call to `https://api.specref.org/bibrefs?refs=...` to resolve bibliography references. This call:
1. Leaks the full list of bibliography keys to a third-party service
2. Creates a runtime availability dependency on `api.specref.org`
3. If `api.specref.org` is ever compromised, malformed bibliography data could be injected into the rendered document

**Implementation**:

The initial attempted fix was adding `noNetwork: true` to `respecConfig` in `valos-spec.html`. Browser network tab testing revealed this was insufficient: `bibrefs?refs=CORS,CSP` was still being fetched from `api.specref.org`.

Investigation showed that `[[[CORS]]]` and `[[[CSP]]]` on line 2938 of `valos-spec.html` are ReSpec's triple-bracket syntax for inline spec links — these trigger a bibliography lookup just like `[[KEY]]` references, but were not present in `localBiblio`. All other 17 cited references were already covered. `noNetwork: true` in ReSpec v35.6.1 does not reliably suppress lookups for references absent from `localBiblio`.

The definitive fix was adding CORS and CSP entries directly to `localBiblio` in `respecConfig`:
```js
CORS: {
  title: "Cross-Origin Resource Sharing",
  href: "https://fetch.spec.whatwg.org/#http-cors-protocol",
  status: "Living Standard",
  publisher: "WHATWG"
},
CSP: {
  title: "Content Security Policy Level 3",
  href: "https://www.w3.org/TR/CSP3/",
  status: "Candidate Recommendation",
  publisher: "W3C"
},
```
`noNetwork: true` was retained as a defence-in-depth measure for any references that may be added in future without a corresponding `localBiblio` entry.

**Residual**: A separate fetch to `https://www.w3.org/standards/history/valos/` (returning 404) is still visible in the network tab. This is a distinct ReSpec feature that checks W3C's publication history for the spec; `noNetwork: true` does not suppress it in v35. It fails gracefully — the 404 is expected since this is not a W3C publication — and has no functional or security impact.

---

### Informational

#### FINDING-08: Predictable Temporary File Path in Shell Script ✅ Fixed

**Severity**: Informational — **Resolved 2026-05-21**  
**File**: previously `scripts/validate-risk-refs.sh`, lines 32–36 (file no longer exists)

**Description**: The script writes to `/tmp/mismatches.txt` — a fixed, predictable, world-writable path. In a TOCTOU scenario, a malicious process on the same machine could pre-create this path as a symlink. In practice, this runs in an isolated GitHub Actions VM where no other user processes exist, so the risk is entirely theoretical.

**Implementation**: Resolved as a side effect of FINDING-13's port. `scripts/validate-risk-refs.sh` was rewritten as `scripts/validate-risk-refs.mjs` (Node ESM) and the bash script deleted in commit `22dbcfd`. The new implementation builds the result list in an in-memory array and prints it directly to stdout — there is no temporary file, predictable or otherwise.

---

#### FINDING-09: PDF Document Metadata — Renderer Identification ⏭️ Out of scope

**Severity**: Informational — **Deferred 2026-05-21** (out of scope for this remediation cycle)  
**File**: `Webflow/documents/ValOS_Governance.pdf`

**Description**: The PDF's producer metadata reads `Skia/PDF m146 Google Docs Renderer`, identifying the document as authored in Google Docs (Chrome 146). Not a vulnerability, but discloses authoring toolchain.

**Decision**: Deferred. The disclosure (Google Docs as authoring tool) is consistent with public information already in the spec — the spec itself references Google Docs–hosted artifacts (FINDING-11) — so the residual marginal disclosure is minimal. The PDF is treated as a build input under `Webflow/documents/` and would need either a one-shot metadata strip (which the next Webflow re-export of the PDF would undo) or a build-time stripping step. If the disclosure becomes a concern, the simplest remediation is a `node scripts/strip-pdf-metadata.mjs` build step using `pdf-lib` (or equivalent) run from `process-webflow.mjs`. Tracking residual risk; no fix in this PR.

---

#### FINDING-10: `.claude/` Historical Commit Risk ✅ Fixed

**Severity**: Informational — **Resolved 2026-05-21**  
**File**: `.claude/settings.local.json`

**Description**: `.claude/settings.local.json` contains a historical entry showing a command was used to remove the `.claude/` directory from git history (`git rebase -i ... --exec "git rm -rf --cached --ignore-unmatch .claude"`). This suggests `.claude/` may have been accidentally committed at some point. The directory is correctly excluded by `.gitignore` now.

**Investigation**: `git log --all --name-only --pretty=format: -- .claude/` (run 2026-05-21) returned a single tracked path: `.claude/security-audit.md`, intentionally committed in `1de1cbf` ("chore: share Claude's security review"). No `.claude/settings.local.json`, no Claude history files, and no other Claude-private state has ever been committed to this repository under any branch. The remediation command in the original audit ("assess whether content is sensitive — if so, history rewrite") therefore does not apply: there is no sensitive content in history to remove. `.gitignore` continues to exclude the rest of `.claude/`, and the existing rebase-exec safeguard in `settings.local.json` remains as defense in depth in case future accidental commits occur.

---

#### FINDING-11: Google Docs Links — Access Control and Link Rot ⏭️ Out of scope

**Severity**: Informational — **Deferred 2026-05-21** (out of scope for this remediation cycle)  
**File**: `valos-spec.html`, lines 2007 and 2050

**Description**: Two Google Docs links are embedded in the specification (Stakeholder Register Spreadsheet, DUCK Incident Response Template). If these have permissive sharing settings ("anyone with the link"), they are effectively public. If the owning account is compromised or documents deleted, links break or could theoretically point to attacker-controlled content.

**Decision**: Deferred to the document owners. The remediation requires actions outside the repository: auditing the sharing settings of both linked Google Docs, deciding whether to host the reference materials locally (e.g. import the Stakeholder Register and Incident Response Template into `valos-spec.html` or `Webflow/documents/`), and establishing an owner-of-record / access-review process. None of these are appropriate fixes for a security PR. Captured under the existing Residual Risk "Google Docs document continuity"; tracking by audit row only.

---

#### FINDING-12: Google Web Font Loader Loaded Without SRI ✅ Fixed

**Severity**: Informational — **Resolved 2026-05-21**  
**File**: previously `Webflow/index.html`, line 13

**Description**: `https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js` is loaded without an `integrity` attribute, while jQuery on the same page correctly uses SRI. This inconsistency means one of two external scripts is verified and one is not. Overlaps with FINDING-02 — implementing a CSP addresses this partially.

**Implementation**: Resolved as part of FINDING-02. `scripts/process-webflow.mjs` strips the `<script src="https://ajax.googleapis.com/.../webfont.js">` tag and the dependent `WebFont.load({...})` inline call at build time. Fonts are served from local vendored copies. The un-SRI'd external load no longer exists in the deployed artifact.

---

#### FINDING-13: Vendor Checksum Verification Is Manual-Only (No CI Enforcement) ✅ Fixed

**Severity**: Informational — **Resolved 2026-05-21**  
**File**: previously `vendor/CHECKSUMS.md` (now removed)

**Description**: `CHECKSUMS.md` documents correct SHA-256 hashes for vendored files and provides manual verification commands, but no CI step automatically runs these checks. A modified vendor file would not be caught before deployment.

**Implementation**: Resolved with a stronger control than the audit asked for. The three runtime-JS dependencies originally tracked (`axe.min.js`, `respec-highlight.js`, `respec-w3c-35.6.1.js`) were eliminated entirely by migrating to build-time ReSpec rendering — they no longer ship in the deployed artifact. ReSpec itself is now an `npm` devDependency pinned at `respec@37.1.0`; `npm ci` against the committed `package-lock.json` enforces upstream package integrity automatically on every CI run.

A new `vendor/CHECKSUMS.md` was introduced once vendored content grew (FINDING-02 added `jquery-3.5.1.min.js`, `fonts.css`, and 8 woff2 binaries alongside the existing `fixup.js` and `base.css`). The manifest contains a fenced ```` ```sha256sum ```` block listing every file under `vendor/` (excluding `*.PATCH.md` documentation and the manifest itself) with its SHA-256 hash; `scripts/verify-vendor.mjs` parses the block and on every `npm run build` recomputes hashes, failing fast on any mismatch, any extra file lacking a recorded hash, or any recorded hash pointing at a missing file. This is wired into the `prebuild` npm hook (`prebuild: npm run validate && npm run verify-vendor`), so a tampered or accidentally-modified vendor file aborts the build before deploy. Intentional re-vendoring is supported via `node scripts/verify-vendor.mjs --update`, which regenerates the hash block for review and commit.

This is stronger than the original audit recommendation: the previous manual `sha256sum -c` step is now automated end-to-end and runs both locally and in CI.

---

## Security Positives (Controls Already in Place)

1. **No runtime third-party JS on `valos-spec.html`**: The spec is rendered to static HTML at build time via the ReSpec CLI (FINDING-05/06/13 remediation). The runtime JS bundles (`respec-w3c`, `respec-highlight`, `axe.min.js`) are no longer shipped. `fixup.js` and `base.css` are vendored locally under `vendor/` and served from the same origin.
2. **Hash-based CSP on the deployed `valos-spec.html`**: `script-src` lists explicit `'sha256-…'` hashes for the two inline scripts in the static output — no `'unsafe-inline'`. `worker-src 'self' blob:` retained for ReSpec's highlighter Web Worker.
3. **SRI on jQuery**: `Webflow/index.html` correctly includes `integrity` and `crossorigin` attributes for the jQuery load.
4. **No secrets in repository**: No hardcoded API keys, tokens, passwords, or credentials found anywhere.
5. **No server-side attack surface**: Static-site architecture eliminates SQL injection, RCE, SSRF, authentication bypass, and session handling risks entirely.
6. **`persist-credentials: false` on checkout**: Deploy workflow prevents the git credential from being written to disk.
7. **GPG commit signing policy**: `CONTRIBUTING.md` requires core team members to sign commits with GPG.
8. **Safe DOM construction**: Prior security work (commit 6272256) replaced `innerHTML` string concatenation with `createElement`/`textContent` patterns in inline JavaScript.
9. **Build-time-produced deployment artifact**: The deploy workflow runs `npm ci && node scripts/build.mjs` and uploads only the resulting `dist/` directory. `dist/` contains only the rendered spec, vendored `fixup.js`/`base.css`, the Webflow landing page (with build-time security transforms applied), and supporting assets — not the full repository, `node_modules/`, or build inputs.
10. **`.gitignore` correctly excludes sensitive paths**: `.DS_Store`, `.claude/`, `dist/` all excluded.
11. **Deploy workflow actions pinned to commit SHAs**: All four GitHub Actions in `deploy.yml` use immutable commit references (remediation for FINDING-04, commit `f2112ed`).

---

## Summary Table

| ID | Title | Severity | Status | Owner |
|---|---|---|---|---|
| FINDING-01 | Missing `rel="noopener noreferrer"` on external links in Webflow | High priority before launch | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-02 | No Content Security Policy on Webflow/index.html | High priority before launch | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-03 | Missing explicit `permissions:` in validate-risk-refs.yml | Should fix soon | ✅ Fixed 2026-05-21 | Sven |
| FINDING-04 | GitHub Actions not pinned to commit SHAs in deploy.yml | Should fix soon | ✅ Fixed 2026-05-21 | Oriol |
| FINDING-05 | `unsafe-inline` in CSP of valos-spec.html | Should fix soon | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-06 | `fixup.js` loaded from W3C CDN without SRI | Should fix soon | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-07 | `api.specref.org` runtime API call | Should fix soon | ✅ Fixed 2026-05-21 | Sven |
| FINDING-08 | Predictable temp file path in shell script | Informational | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-09 | PDF metadata reveals authoring tool | Informational | ⏭️ Out of scope | doc owners |
| FINDING-10 | `.claude/` historical commit risk | Informational | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-11 | Google Docs links — access control and link rot | Informational | ⏭️ Out of scope | doc owners |
| FINDING-12 | Google Web Font loader loaded without SRI | Informational | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-13 | Vendor checksum verification is manual-only | Informational | ✅ Fixed 2026-05-21 | Ivan |

---

## Residual Risks

After remediation of the findings above, the following risks would remain:

1. **Webflow platform / design tool trust**: The Webflow design tool produces the `Webflow/index.html` export that ships as the landing page. The export is reviewed at PR time and transformed by `scripts/process-webflow.mjs` to enforce security invariants (FINDING-01, FINDING-02, FINDING-12). A compromise of the Webflow design tool itself or the maintainer's Webflow account could change the export structure; the build script will warn (FINDING-01) or error (FINDING-02) if its preconditions no longer match. Any external resources that `webflow.js` attempts to fetch at runtime (e.g. the Webflow attribution badge inserted dynamically) are now blocked by the page's `img-src 'self' data:` CSP — visually cosmetic but not blocking functionality.
2. **Google Docs document continuity**: The two linked Google Docs files depend on account continuity outside this repository.
3. **specref.org API**: Although `noNetwork: true` plus complete `localBiblio` coverage eliminated the call at audit time, runtime bibliography resolution would resume if a future reference is added without a corresponding `localBiblio` entry. The build-time render in `scripts/build.mjs` further mitigates this — any biblio fetch happens during `node scripts/build.mjs` in CI, not in visitors' browsers — but the trust dependency on `api.specref.org` remains if the source ever adds an unresolved reference.
4. **ReSpec build-tool dependency**: ReSpec is now a build-time devDependency (pinned to `respec@37.1.0` via `package-lock.json`). A future compromise of the `respec` npm package would inject malicious content into the rendered artifact. `npm ci` verifies the package against the lockfile's integrity hash, mitigating tag-mutation/registry attacks; trust in the npm registry remains a baseline dependency.
5. **GitHub Actions ecosystem**: The deploy workflow mitigates tag-mutation risk via SHA pinning (FINDING-04). Other workflows (e.g. `validate-risk-refs.yml`) may still use mutable tags; trust in GitHub's actions infrastructure remains a baseline dependency.

---

## Audit Limitations

1. **No dynamic analysis**: This audit is based on static review only. No browser-based testing, interception proxy, or fuzzing was performed.
2. **Webflow hosting not audited**: Webflow's actual serving configuration (HTTP response headers, CDN settings, TLS) was not directly accessible. FINDING-02 is based on the HTML source alone.
3. **GitHub repository settings not audited**: Branch protection rules, CODEOWNERS, and organization-level permission defaults were not directly accessible. FINDING-03 assumes worst-case defaults.
4. **Webflow.js not fully decompiled**: `webflow.js` was analyzed via pattern matching. Key patterns checked (`innerHTML`, `document.write`, `eval(`, `localStorage`, `cookie`) returned no hits.
5. **Commit history secret scan was limited**: Current working tree checked exhaustively. A full history scan with `trufflehog` or `git-secrets` across all commits was not performed. Running `git log --all --oneline -- .claude/` is recommended (see FINDING-10).
