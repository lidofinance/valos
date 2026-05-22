# fixup.js — patch notes

- **Upstream**: https://www.w3.org/scripts/TR/2021/fixup.js (downloaded 2026-05-21, 429 lines)
- **Removed**: lines 276–366 — the "Deprecation warning" block that `XMLHttpRequest`s `https://www.w3.org/TR/tr-outdated-spec`. The block's hostname gate already prevents the call from firing on `lidofinance.github.io`; removing it eliminates dead code and hardens the artifact against rehosting.

## Re-derive from upstream

```sh
curl -sS -o /tmp/fixup.js.orig https://www.w3.org/scripts/TR/2021/fixup.js
sed '276,366d' /tmp/fixup.js.orig > /tmp/fixup.js.patched
diff /tmp/fixup.js.patched vendor/fixup.js
```

If upstream changes, locate the new line range of the `/* Deprecation warning */` block before re-applying.

## Inert remaining references

The patched file still mentions `https://www.w3.org/StyleSheets/TR/2021/dark` and `.../logos/dark.svg`. Both are inside a dark-mode block that runs only if the document includes a `<link>` to W3C's `dark.css` — which ValOS does not. These strings never resolve to network calls under the current deployment.
