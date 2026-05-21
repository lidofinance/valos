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

#### FINDING-01: Missing `rel="noopener noreferrer"` on All External Links in Webflow/index.html

**Severity**: High priority before launch  
**File**: `Webflow/index.html` (all `target="_blank"` anchors — ~18 links to external partner organizations)

**Description**: Every `target="_blank"` anchor in `Webflow/index.html` is missing `rel="noopener noreferrer"`. This covers all outbound links to Telegram, GitHub, and partner organization sites.

**Exploitation**: When a user clicks one of these links, the opened tab receives a reference to the opener window via `window.opener`. A malicious destination page (or one that is later compromised) can call `window.opener.location = "https://phishing-site.com"` to silently redirect the original ValOS page while the user is reading the new tab. This is the well-known tabnapping attack. Given that the ValOS landing page links to 18 external partner organizations, any one being compromised in the future creates an indirect attack path against ValOS visitors.

**Why it matters**: The ValOS landing page is an authoritative standard used by node operators managing validator keys and staking infrastructure. A tabnapping attack could redirect operators to a phishing page impersonating ValOS, potentially capturing credentials or convincing them to download malicious tooling.

**Remediation**: Add `rel="noopener noreferrer"` to every `target="_blank"` anchor:
```html
<a href="https://lionscraft.io" target="_blank" rel="noopener noreferrer">
```

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

#### FINDING-03: GitHub Actions Workflow Lacks Explicit Permissions Block (validate-risk-refs.yml)

**Severity**: Should fix soon  
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

#### FINDING-05: `unsafe-inline` in Content Security Policy (valos-spec.html)

**Severity**: Should fix soon  
**File**: `valos-spec.html`, line 5

**Description**: The CSP on `valos-spec.html` permits `'unsafe-inline'` in `script-src`:
```
script-src 'self' 'unsafe-inline' https://www.w3.org/scripts/;
```
`'unsafe-inline'` for `script-src` renders the CSP largely ineffective against XSS — any injected inline `<script>` tag would execute without restriction. The respec framework uses an inline `<script class="remove">` block which necessitated this inclusion.

**Context**: Since `valos-spec.html` has no user input paths, the actual XSS risk is low. An attacker would need repository write access to inject script content. This is a defense-in-depth weakness rather than a directly exploitable vulnerability in the current architecture.

**Remediation options**:
1. **Hash-based CSP** (recommended for static files): Compute the SHA-256 hash of the inline script block and replace `'unsafe-inline'` with `'sha256-{hash}'`. This allows the single known-good inline script while blocking any injected script.
2. **Accept as residual risk**: Document explicitly given the no-user-input architecture.

---

#### FINDING-06: `fixup.js` Loaded from W3C CDN Without SRI

**Severity**: Should fix soon  
**File**: `vendor/respec-w3c-35.6.1.js`, line 736

**Description**: `respec-w3c-35.6.1.js` dynamically creates a `<script>` tag that loads `https://www.w3.org/scripts/TR/2021/fixup.js` at runtime without SRI. The `CHECKSUMS.md` notes this as a deliberate decision due to CORS limitations.

**Exploitation**: Any modification to `fixup.js` on W3C's server would be served and executed undetected. The spec page is a reference for node operators making security decisions — a compromised `fixup.js` could inject content or perform phishing within the spec page.

**Remediation**:
1. Re-verify CORS availability: `curl -I https://www.w3.org/scripts/TR/2021/fixup.js | grep -i "access-control"`. If CORS headers are present, SRI becomes possible.
2. If feasible, vendor `fixup.js` locally and add its hash to `CHECKSUMS.md`.
3. If not feasible, document the accepted risk in `CHECKSUMS.md` (partially done already).

---

#### FINDING-07: `api.specref.org` Runtime API Call — Privacy and Availability Dependency

**Severity**: Should fix soon  
**File**: `vendor/respec-w3c-35.6.1.js` (embedded respec behavior)

**Description**: When `valos-spec.html` renders, respec makes an outbound API call to `https://api.specref.org/bibrefs?refs=...` to resolve bibliography references. This call:
1. Leaks the full list of bibliography keys to a third-party service
2. Creates a runtime availability dependency on `api.specref.org`
3. If `api.specref.org` is ever compromised, malformed bibliography data could be injected into the rendered document

**Remediation**: Verify that all bibliography entries used in the spec are already defined in the `localBiblio` configuration in `respecConfig` (lines 3522–3633 of `valos-spec.html`). `localBiblio` entries take precedence over network API calls in respec. Ensuring complete `localBiblio` coverage would prevent the outbound call entirely for those references.

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

#### FINDING-13: Vendor Checksum Verification Is Manual-Only (No CI Enforcement)

**Severity**: Informational  
**File**: `vendor/CHECKSUMS.md`

**Description**: `CHECKSUMS.md` documents correct SHA-256 hashes for vendored files and provides manual verification commands, but no CI step automatically runs these checks. A modified vendor file would not be caught before deployment.

**Verified at audit time**: All three vendor file hashes match documented values:
- `axe.min.js`: `7dbfabdfc6062936d79c873ddbb5f811a1219fca3928bd8cc9dd81f1e65f4720` ✓
- `respec-highlight.js`: `bb3a399f42113070cd0efcd3e2b93cf59680721a94808721b1ccff7b18928b5b` ✓
- `respec-w3c-35.6.1.js`: `83c4274c7fd3ce32598a166c6ccea3c4429bc6761ef839d74ebd01304e4834a3` ✓

**Remediation**: Add a CI step to the deploy workflow:
```yaml
- name: Verify vendor checksums
  run: |
    echo "7dbfabdfc6062936d79c873ddbb5f811a1219fca3928bd8cc9dd81f1e65f4720  vendor/axe.min.js" | sha256sum -c
    echo "bb3a399f42113070cd0efcd3e2b93cf59680721a94808721b1ccff7b18928b5b  vendor/respec-highlight.js" | sha256sum -c
```

---

## Security Positives (Controls Already in Place)

1. **Vendor dependency isolation**: All three JavaScript dependencies are vendored locally rather than loaded from external CDNs at runtime.
2. **CSP on valos-spec.html**: Implemented with minimal necessary external origins and appropriate `worker-src 'self' blob:` for respec's Web Worker.
3. **SRI on jQuery**: `Webflow/index.html` correctly includes `integrity` and `crossorigin` attributes for the jQuery load.
4. **No secrets in repository**: No hardcoded API keys, tokens, passwords, or credentials found anywhere.
5. **No server-side attack surface**: Static-site architecture eliminates SQL injection, RCE, SSRF, authentication bypass, and session handling risks entirely.
6. **`persist-credentials: false` on checkout**: Deploy workflow prevents the git credential from being written to disk.
7. **GPG commit signing policy**: `CONTRIBUTING.md` requires core team members to sign commits with GPG.
8. **Safe DOM construction**: Prior security work (commit 6272256) replaced `innerHTML` string concatenation with `createElement`/`textContent` patterns in inline JavaScript.
9. **Minimal deployment scope**: Deploy workflow only copies `valos-spec.html`, `LICENSE`, `assets/`, and `vendor/` — not the full repository.
10. **`.gitignore` correctly excludes sensitive paths**: `.DS_Store`, `.claude/`, `dist/` all excluded.
11. **Deploy workflow actions pinned to commit SHAs**: All four GitHub Actions in `deploy.yml` use immutable commit references (remediation for FINDING-04, commit `f2112ed`).

---

## Summary Table

| ID | Title | Severity | Owner |
|---|---|---|---|
| FINDING-01 | Missing `rel="noopener noreferrer"` on external links in Webflow | High priority before launch | Ivan |
| FINDING-02 | No Content Security Policy on Webflow/index.html | High priority before launch | Sven/DevOps |
| FINDING-03 | Missing explicit `permissions:` in validate-risk-refs.yml | Should fix soon | Sven |
| FINDING-04 | GitHub Actions not pinned to commit SHAs in deploy.yml | ~~Should fix soon~~ **Remediated** (2026-05-21) | Oriol |
| FINDING-05 | `unsafe-inline` in CSP of valos-spec.html | Should fix soon | Ivan |
| FINDING-06 | `fixup.js` loaded from W3C CDN without SRI | Should fix soon | Ivan |
| FINDING-07 | `api.specref.org` runtime API call | Should fix soon | Sven |
| FINDING-08 | Predictable temp file path in shell script | Informational | - |
| FINDING-09 | PDF metadata reveals authoring tool | Informational | - |
| FINDING-10 | `.claude/` historical commit risk | Informational | - |
| FINDING-11 | Google Docs links — access control and link rot | Informational | - |
| FINDING-12 | Google Web Font loader loaded without SRI | Informational | - |
| FINDING-13 | Vendor checksum verification is manual-only | Informational | Ivan |

---

## Residual Risks

After remediation of the findings above, the following risks would remain:

1. **W3C CDN trust**: The `fixup.js` runtime load from W3C represents a trust dependency on W3C infrastructure. Considered acceptable given W3C's role as a standards body.
2. **Webflow platform security**: The Webflow landing page's hosting infrastructure is outside this repository's controls.
3. **Google Docs document continuity**: The two linked Google Docs files depend on account continuity outside this repository.
4. **specref.org API**: Runtime bibliography resolution via `api.specref.org` introduces a soft dependency that cannot be fully controlled.
5. **GitHub Actions ecosystem**: The deploy workflow mitigates tag-mutation risk via SHA pinning (FINDING-04). Other workflows (e.g. `validate-risk-refs.yml`) may still use mutable tags; trust in GitHub's actions infrastructure remains a baseline dependency.

---

## Audit Limitations

1. **No dynamic analysis**: This audit is based on static review only. No browser-based testing, interception proxy, or fuzzing was performed.
2. **Webflow hosting not audited**: Webflow's actual serving configuration (HTTP response headers, CDN settings, TLS) was not directly accessible. FINDING-02 is based on the HTML source alone.
3. **GitHub repository settings not audited**: Branch protection rules, CODEOWNERS, and organization-level permission defaults were not directly accessible. FINDING-03 assumes worst-case defaults.
4. **Webflow.js not fully decompiled**: `webflow.js` was analyzed via pattern matching. Key patterns checked (`innerHTML`, `document.write`, `eval(`, `localStorage`, `cookie`) returned no hits.
5. **Commit history secret scan was limited**: Current working tree checked exhaustively. A full history scan with `trufflehog` or `git-secrets` across all commits was not performed. Running `git log --all --oneline -- .claude/` is recommended (see FINDING-10).
