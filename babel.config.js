module.exports = {
  presets: [
    ['@babel/preset-env', { targets: 'defaults' } ],
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
  ],
};
