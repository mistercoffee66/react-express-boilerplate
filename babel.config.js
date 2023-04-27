// as of babel 7, babel.config.js is for project-level config and .babelrc is optional file-level configs
// https://babeljs.io/docs/en/config-files
// eslint-disable-next-line arrow-parens
module.exports = (api) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic'
      }
    ]
  ],
  plugins: api.env('local') ? ['react-refresh/babel'] : []
});
