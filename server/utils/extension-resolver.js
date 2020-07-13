const resolve = require('resolve');
const path = require('path');

/* eslint no-param-reassign: 0 */

function hasExpoWeb() {
  try {
    resolve.sync('expo-web');
    return true;
  } catch (error) {
    return false;
  }
}

function resolvePath(sourcePath, currentFile) {
  const hasVectorIcons = sourcePath.match(/(react-native-vector-icons|@expo\/vector-icons)/g);
  if (hasVectorIcons) {
    if (hasExpoWeb()) {
      return sourcePath.replace(/(react-native-vector-icons)/g, 'expo-web/dist/exports');
    }
    return sourcePath;
  }

  if (sourcePath.match(/^(react|react-dom|react-native|expo|react-navigation)$/g)) {
    return sourcePath;
  }

  return resolve.sync(sourcePath, {
    basedir: path.resolve(currentFile, '..'),
    extensions: ['.server.js', '.web.js', '.js'],
    packageFilter: (pkg) => {
      if (pkg.main) {
        pkg.main = pkg.main.match(/(.+?)\.[^.]*$|$/)[1] || pkg.main;
      }
      return pkg;
    },
  });
}

function mapPathString(nodePath, state) {
  if (!state.types.isStringLiteral(nodePath)) {
    return;
  }
  const sourcePath = nodePath.node.value;
  const currentFile = state.file.opts.filename;
  const modulePath = resolvePath(sourcePath, currentFile, state.opts);
  if (modulePath) {
    if (nodePath.node.pathResolved) {
      return;
    }
    nodePath.replaceWith(state.types.stringLiteral(modulePath));
    nodePath.node.pathResolved = true;
  }
}

const importVisitors = {
  'ImportDeclaration|ExportDeclaration': (nodePath, state) => {
    mapPathString(nodePath.get('source'), state);
  },
};

module.exports = ({ types }) => ({
  name: 'File extension resolver',

  pre() {
    this.types = types;
  },

  visitor: {
    Program: {
      enter(programPath, state) {
        programPath.traverse(importVisitors, state);
      },
    },
  },
});
