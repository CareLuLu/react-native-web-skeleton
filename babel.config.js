module.exports = {
  presets: ['babel-preset-expo', 'module:react-native-dotenv'],
  plugins: [
    ['lodash', { id: ['lodash', 'underscore.string'] }],
  ],
  env: {
    development: {
      plugins: [
        '@babel/plugin-transform-react-jsx-source',
      ],
    },
    production: {
      plugins: [
        'transform-react-remove-prop-types',
      ],
    },
  },
};
