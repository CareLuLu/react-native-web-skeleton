const LoadablePlugin = require('@loadable/webpack-plugin'); // eslint-disable-line
const {
  override,
  addBabelPlugin,
  addExternalBabelPlugin,
  addWebpackPlugin,
  addBundleVisualizer,
} = require('customize-cra'); // eslint-disable-line

module.exports = override(
  // loadable plugin to identify bundles
  addBabelPlugin('@loadable/babel-plugin'),

  addExternalBabelPlugin('@babel/plugin-proposal-class-properties', { loose: true }),
  addExternalBabelPlugin('@babel/plugin-transform-react-jsx'),

  // use individual exports
  addBabelPlugin(['lodash', {
    id: [
      'lodash',
      'underscore.string',
    ],
  }]),

  // remove prop-types
  process.env.NODE_ENV === 'production' && addBabelPlugin('transform-react-remove-prop-types'),

  // loadable plugin to identify bundles
  addWebpackPlugin(new LoadablePlugin()),

  // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
  process.env.BUNDLE_VISUALIZE === '1' && addBundleVisualizer(),
);
