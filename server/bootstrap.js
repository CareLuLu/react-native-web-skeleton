const path = require('path');

require('@babel/register')({
  cache: false,
  ignore: [],
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    '@loadable/babel-plugin',
    '@babel/plugin-transform-runtime',
    path.resolve(__dirname, 'utils/module-resolver.js'),
    path.resolve(__dirname, 'utils/extension-resolver.js'),
  ],
});

global.fetch = require('node-fetch');

const noop = () => {};
global.window = {
  fetch,
  open: noop,
  addEventListener: noop,
  getComputedStyle: noop,
  scrollY: 0,
  scrollX: 0,
  innerHeight: 642,
  innerWidth: 1280,
  navigator: 'user-agent',
  hydrated: true,
};

require('./index');
