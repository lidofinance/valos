module.exports = {
  server: '.',
  startPath: 'valos-spec.html',
  files: 'valos-spec.html',
  snippetOptions: {
    rule: {
      match: /<\/head>/i,
      fn: (snippet, match) =>
        `<style id="bs-hide-respec-ui">#respec-ui{display:none !important}</style>${snippet}${match}`,
    },
  },
};
