const { execFileSync } = require('node:child_process');

module.exports = {
  server: '.',
  startPath: 'valos-spec.html',
  // editing any structured source re-assembles valos-spec.html, whose change
  // then triggers the reload below
  files: [
    'valos-spec.html',
    {
      match: ['risks/**', 'controls/**', 'mitigations/**', 'templates/**'],
      fn() {
        try {
          execFileSync('node', ['scripts/assemble.mjs'], { stdio: 'inherit' });
        } catch {
          // validation errors are already printed; keep watching
        }
      },
    },
  ],
  watchEvents: ['change', 'add', 'unlink'],
  snippetOptions: {
    rule: {
      match: /<\/head>/i,
      fn: (snippet, match) =>
        `<style id="bs-hide-respec-ui">#respec-ui{display:none !important}</style>${snippet}${match}`,
    },
  },
};
