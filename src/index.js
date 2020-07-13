/* eslint import/newline-after-import: 0 */
/* eslint import/first: 0 */

// IMPORTANT THIS POLYFILL MUST BE INCLUDED BEFORE any RNW (react-native) imports
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = window.ResizeObserver || ResizeObserver;
import 'raf/polyfill';

import { loadableReady } from '@loadable/component';
import { AppRegistry } from 'react-native';
import App from './App';

loadableReady(() => {
  window.hydrated = false;
  AppRegistry.registerComponent('App', () => App);
  AppRegistry.runApplication('App', {
    rootTag: document.getElementById('root'),
    callback: () => {
      window.hydrated = true;
      const serverCss = document.querySelector('style[amp-custom]');
      if (serverCss) {
        serverCss.remove();
      }
    },
  });
});
