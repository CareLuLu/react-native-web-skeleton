import * as WebBrowser from 'expo-web-browser';
import { createMemoryHistory } from 'history';

const protocolRegex = /^[a-zA-Z\-_]+:\/\//;

const createHistory = () => {
  const history = createMemoryHistory();
  const { push } = history;
  try {
    history.clear = () => {
      history.entries.splice(1, history.entries.length);
      history.index = 0;
    };
    history.push = (to, ...extra) => {
      if (typeof to === 'string') {
        if (protocolRegex.test(to)) {
          return WebBrowser.openBrowserAsync(to);
        }
      }
      return push.call(history, to, ...extra);
    };
    history.pushBlank = (...args) => {
      history.push(...args);
    };
  } catch (err) {
    // ignore warning
  }
  return history;
};

export default createHistory;
