import { createLocation, createBrowserHistory } from 'history';

const protocolRegex = /^[a-zA-Z\-_]+:\/\//;

const createHistory = () => {
  const history = createBrowserHistory();
  try {
    history.clear = () => {};
    history.pushBlank = (to) => {
      let href;
      if (typeof to === 'string' && protocolRegex.test(to)) {
        href = to;
      } else {
        const location = typeof to === 'string'
          ? createLocation(to, null, null, history.location) : to;
        href = history.createHref(location);
      }
      window.open(href, '_blank');
    };

    const { push } = history;
    history.push = (to, ...extra) => {
      if (typeof to === 'string') {
        if (protocolRegex.test(to)) {
          window.location.href = to;
          return;
        }
      }
      push.call(history, to, ...extra);
    };
  } catch (err) {
    // ignore warning
  }
  return history;
};

export default createHistory;
