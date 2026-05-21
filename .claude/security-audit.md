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

#### FINDING-02: No Content Security Policy on Webflow/index.html

**Severity**: High priority before launch  
**File**: `Webflow/index.html`

**Description**: The Webflow landing page has no `Content-Security-Policy` meta tag or equivalent header. In contrast, `valos-spec.html` has a well-considered CSP. The Webflow page loads scripts from three external origins without policy enforcement:
- `https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js` (no SRI, no CSP)
- `https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min...js` (SRI present, but no CSP fallback)
- Local `js/webflow.js` (no SRI)

**Exploitation**: If any of these external script sources is compromised (Google APIs CDN, Webflow's CloudFront distribution), an attacker can inject arbitrary JavaScript into every visitor's browser with no policy enforcement to block it. Since the Webflow page is the public-facing front door for the ValOS standard and links directly to community resources, a supply chain compromise would reach the entire ValOS audience.

**Why it matters**: XSS or CDN compromise on an unprotected page is the highest-impact web attack scenario for a static site. The Google Web Font loader (`webfont.js`) is loaded without SRI, meaning any modification to that file on Google's CDN would execute with full script privileges.

**Remediation**:
1. Add a restrictive CSP meta tag to `Webflow/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="script-src 'self' https://ajax.googleapis.com https://d3e54v103j8qbb.cloudfront.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; default-src 'self'">
```
2. Add SRI to the Google Web Font loader:
```html
<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
        integrity="sha256-[COMPUTED_HASH]"
        crossorigin="anonymous"></script>
```
3. Note: Webflow's platform may impose limitations on custom code injection — check custom code settings in Webflow's hosting configuration.

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

#### FINDING-08: Predictable Temporary File Path in Shell Script

**Severity**: Informational  
**File**: `scripts/validate-risk-refs.sh`, lines 32–36

**Description**: The script writes to `/tmp/mismatches.txt` — a fixed, predictable, world-writable path. In a TOCTOU scenario, a malicious process on the same machine could pre-create this path as a symlink. In practice, this runs in an isolated GitHub Actions VM where no other user processes exist, so the risk is entirely theoretical.

**Remediation**: Use `mktemp` for safety:
```bash
MISMATCH_FILE=$(mktemp)
trap "rm -f $MISMATCH_FILE" EXIT
```

---

#### FINDING-09: PDF Document Metadata — Renderer Identification

**Severity**: Informational  
**File**: `Webflow/documents/ValOS_Governance.pdf`

**Description**: The PDF's producer metadata reads `Skia/PDF m146 Google Docs Renderer`, identifying the document as authored in Google Docs (Chrome 146). Not a vulnerability, but discloses authoring toolchain.

**Remediation**: Strip metadata if tooling disclosure is a concern: `exiftool -all= ValOS_Governance.pdf`.

---

#### FINDING-10: `.claude/` Historical Commit Risk

**Severity**: Informational  
**File**: `.claude/settings.local.json`

**Description**: `.claude/settings.local.json` contains a historical entry showing a command was used to remove the `.claude/` directory from git history (`git rebase -i ... --exec "git rm -rf --cached --ignore-unmatch .claude"`). This suggests `.claude/` may have been accidentally committed at some point. The directory is correctly excluded by `.gitignore` now.

**Remediation**: Run `git log --all --oneline -- .claude/` to verify no historical commits contain this directory. If any do, assess whether content is sensitive — if so, use `git filter-repo` or BFG for history rewrite.

---

#### FINDING-11: Google Docs Links — Access Control and Link Rot

**Severity**: Informational  
**File**: `valos-spec.html`, lines 2006, 2049

**Description**: Two Google Docs links are embedded in the specification (Stakeholder Register Spreadsheet, DUCK Incident Response Template). If these have permissive sharing settings ("anyone with the link"), they are effectively public. If the owning account is compromised or documents deleted, links break or could theoretically point to attacker-controlled content.

**Remediation**: Audit sharing settings for both documents. Consider hosting reference materials within the repository or at a controlled URL. Document ownership in an access review process.

---

#### FINDING-12: Google Web Font Loader Loaded Without SRI

**Severity**: Informational  
**File**: `Webflow/index.html`, line 13

**Description**: `https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js` is loaded without an `integrity` attribute, while jQuery on the same page correctly uses SRI. This inconsistency means one of two external scripts is verified and one is not. Overlaps with FINDING-02 — implementing a CSP addresses this partially.

---

#### FINDING-13: Vendor Checksum Verification Is Manual-Only (No CI Enforcement) ✅ Fixed

**Severity**: Informational — **Resolved 2026-05-21**  
**File**: previously `vendor/CHECKSUMS.md` (now removed)

**Description**: `CHECKSUMS.md` documents correct SHA-256 hashes for vendored files and provides manual verification commands, but no CI step automatically runs these checks. A modified vendor file would not be caught before deployment.

**Implementation**: The three runtime-JS dependencies tracked by `CHECKSUMS.md` (`axe.min.js`, `respec-highlight.js`, `respec-w3c-35.6.1.js`) were removed entirely as part of the migration to build-time ReSpec rendering — they no longer ship in the deployed artifact. ReSpec itself is now an `npm` devDependency pinned at `respec@37.1.0`; `npm ci` against the committed `package-lock.json` enforces cryptographic integrity of the upstream package automatically on every CI run. The remaining vendored assets — `vendor/fixup.js` (patched) and `vendor/base.css` — are committed source-of-truth files; their integrity is anchored in git history and reviewed as part of any PR that modifies them. `CHECKSUMS.md` was deleted alongside its now-irrelevant entries.

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
| FINDING-02 | No Content Security Policy on Webflow/index.html | High priority before launch | Open | Sven/DevOps |
| FINDING-03 | Missing explicit `permissions:` in validate-risk-refs.yml | Should fix soon | ✅ Fixed 2026-05-21 | Sven |
| FINDING-04 | GitHub Actions not pinned to commit SHAs in deploy.yml | Should fix soon | ✅ Fixed 2026-05-21 | Oriol |
| FINDING-05 | `unsafe-inline` in CSP of valos-spec.html | Should fix soon | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-06 | `fixup.js` loaded from W3C CDN without SRI | Should fix soon | ✅ Fixed 2026-05-21 | Ivan |
| FINDING-07 | `api.specref.org` runtime API call | Should fix soon | ✅ Fixed 2026-05-21 | Sven |
| FINDING-08 | Predictable temp file path in shell script | Informational | Open | - |
| FINDING-09 | PDF metadata reveals authoring tool | Informational | Open | - |
| FINDING-10 | `.claude/` historical commit risk | Informational | Open | - |
| FINDING-11 | Google Docs links — access control and link rot | Informational | Open | - |
| FINDING-12 | Google Web Font loader loaded without SRI | Informational | Open | - |
| FINDING-13 | Vendor checksum verification is manual-only | Informational | ✅ Fixed 2026-05-21 | Ivan |

---

## Residual Risks

After remediation of the findings above, the following risks would remain:

1. **Webflow platform security**: The Webflow landing page's hosting infrastructure (and the original Webflow design tool) is outside this repository's controls. Note: the deployed `dist/index.html` is now produced by `scripts/process-webflow.mjs` from the committed `Webflow/index.html` export — runtime third-party loads (Google Fonts, jQuery from CloudFront, Webflow badge SVGs) are still present and tracked under FINDING-02 / FINDING-12.
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
