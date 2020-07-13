/* eslint no-param-reassign: 0 */

const isReactNativeRequire = (t, node) => {
  const { declarations } = node;
  if (declarations.length > 1) {
    return false;
  }
  const { id, init } = declarations[0];
  return (
    (t.isObjectPattern(id) || t.isIdentifier(id))
    && t.isCallExpression(init)
    && t.isIdentifier(init.callee)
    && init.callee.name === 'require'
    && init.arguments.length === 1
    && (init.arguments[0].value === 'react-native' || init.arguments[0].value === 'react-native-web')
  );
};

const isReactNativeModule = ({ source, specifiers }) => (
  source
  && (source.value === 'react-native' || source.value === 'react-native-web')
  && specifiers.length
);

module.exports = function config({ types: t }) {
  return {
    name: 'Rewrite react-native to react-native-web',
    visitor: {
      ImportDeclaration(path) {
        if (isReactNativeModule(path.node)) {
          path.node.source.value = 'react-native-web';
        }
      },
      ExportNamedDeclaration(path) {
        if (isReactNativeModule(path.node)) {
          path.node.source.value = 'react-native-web';
        }
      },
      VariableDeclaration(path) {
        if (isReactNativeRequire(t, path.node)) {
          path.node.declarations[0].init.arguments[0].value = 'react-native-web';
        }
      },
    },
  };
};
