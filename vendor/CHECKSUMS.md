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

### respec-w3c-35.6.1.js
- **Source**: npm respec@35.6.1 (builds/respec-w3c.js)
- **Base SHA256**: `4af427b606cc5b9331bf4d398aa31412d9051184049e5ad39873e7fd9fdf94c4`
- **Local SHA256**: `5e9c7fcd4e0d76389398bddc5e4eb17a6ceb110a6baccbc69fb32cf29d9c64f2`
- **Status**: ✅ Verified (modified for local path configuration)
- **Changes**: URL for respec-highlight.js changed from CDN (`https://www.w3.org/Tools/respec/respec-highlight`) to local path (`/vendor/respec-highlight.js`) to support vendored deployment
- **Note**: Dynamically loads axe.min.js and respec-highlight.js as needed

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
