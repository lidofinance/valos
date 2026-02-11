# Vendor Checksums

This document verifies the integrity of vendored JavaScript files against their official sources.

## Verification Date
2026-02-03

## Files

### axe.min.js
- **Source**: npm axe-core@4.11.1
- **SHA256**: `7dbfabdfc6062936d79c873ddbb5f811a1219fca3928bd8cc9dd81f1e65f4720`
- **Verified**: ✅ Matches official npm package
- **Command**: `npm pack axe-core@4.11.1 && tar -xzf axe-core-4.11.1.tgz && sha256sum package/axe.min.js`

### respec-highlight.js
- **Source**: npm respec@35.6.1 (builds/respec-highlight.js)
- **SHA256**: `bb3a399f42113070cd0efcd3e2b93cf59680721a94808721b1ccff7b18928b5b`
- **Verified**: ✅ Matches official respec package
- **Command**: `npm pack respec@35.6.1 && tar -xzf respec-35.6.1.tgz && sha256sum package/builds/respec-highlight.js`
- **Reason for Vendoring**: Originally loaded dynamically by respec-w3c-35.6.1.js. Vendored locally to satisfy CSP requirements (`script-src 'self' 'unsafe-inline'`) and avoid external CDN dependency for supply chain security compliance

### respec-w3c-35.6.1.js
- **Source**: npm respec@35.6.1 (builds/respec-w3c.js)
- **Base SHA256**: `4af427b606cc5b9331bf4d398aa31412d9051184049e5ad39873e7fd9fdf94c4`
- **Current SHA256**: `83c4274c7fd3ce32598a166c6ccea3c4429bc6761ef839d74ebd01304e4834a3`
- **Status**: ✅ Verified (modified for local deployment)
- **Changes** (3 string replacements):
  1. `"https://www.w3.org/Tools/respec/respec-highlight"` → `"/vendor/respec-highlight.js"` (preload hint URL)
  2. `"https://cdn.jsdelivr.net/npm/axe-core@4/axe.min.js"` → `"/vendor/axe.min.js"` (axe-core script src)
  3. `importScripts("https://www.w3.org/Tools/respec/respec-highlight")` → `importScripts(self.location.origin+"/vendor/respec-highlight.js")` (Web Worker importScripts)
- **Note**: All three changes replace external CDN URLs with local paths to satisfy CSP requirements and avoid external dependencies. fixup.js loads from W3C CDN (whitelisted in CSP).



## Re-verification

To verify these files haven't been tampered with, run:

```bash
# Verify axe.min.js
npm pack axe-core@4.11.1 && tar -xzf axe-core-4.11.1.tgz && \
  sha256sum -c <(echo "7dbfabdfc6062936d79c873ddbb5f811a1219fca3928bd8cc9dd81f1e65f4720  package/axe.min.js")

# Verify respec-highlight.js
npm pack respec@35.6.1 && tar -xzf respec-35.6.1.tgz && \
  sha256sum -c <(echo "bb3a399f42113070cd0efcd3e2b93cf59680721a94808721b1ccff7b18928b5b  package/builds/respec-highlight.js")
```

If either check fails, the file has been modified and should not be used.
