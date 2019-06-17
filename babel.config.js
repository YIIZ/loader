module.exports = {
  presets: [
    ['@babel/preset-env', { targets: 'defaults' } ],
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { corejs: 3, useESModules: false }],
    '@babel/plugin-syntax-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
  ],
};
