import React, { memo } from 'react';
import { Platform } from 'react-native';
import { Redirect as RedirectRN } from 'react-router';
import { matchRoutes } from 'react-router-config';
import { last } from 'lodash';
import { isSSR } from 'react-native-web-ui-components/utils';
import generatePath from '../utils/generatePath';
import getLocationUrl from '../utils/getLocationUrl';
import getItemHash from '../utils/getItemHash';
import getUrl from '../utils/getUrl';
import Splash from '../components/Splash';

/* eslint react/prop-types: 0 */

import {
  Root,
  NotFound,
  NetworkError,
  UnknownError,
  Home,
  About,
  Login,
  Signup,
  Logout,
} from './screens';

const reAmp = /^\/amp(\/[^/])?/;

const routes = [];
const SSR_MODE = isSSR();

const noop = () => () => <Splash />;

const open = (Component) => {
  // Memo here is important to make sure it's not
  // re-rendered because of user.mock changes. This
  // is only required for redirect and restrict pages.
  const Renderer = memo(
    props => <Component {...props} />,
    (prevProps, nextProps) => (
      getLocationUrl(prevProps.location) === getLocationUrl(nextProps.location)
      && getItemHash(prevProps.user) === getItemHash(nextProps.user)
    ),
  );
  Renderer.displayName = Component.name;
  return Renderer;
};

let redirect = ({ push, path }) => { // eslint-disable-line
  const Redirect = (props) => {
    const { location, profile, urlParams } = props;
    if (reAmp.test(location.pathname)) {
      return (
        <RedirectRN
          push={push}
          to={generatePath(path, { ...profile.params, ...urlParams })}
        />
      );
    }
    return null;
  };

  return Redirect;
};
if (!SSR_MODE) {
  redirect = ({ push, path }) => { // eslint-disable-line
    const Redirect = (props) => {
      const {
        user,
        error,
        profile,
        refetch,
        urlParams,
      } = props;

      if (user.mock && error && error === 'Network error. Please check your internet connection.') {
        return <RedirectRN replace to={getUrl('/network-error')} />;
      }

      if (user.mock) {
        setTimeout(() => refetch());
        return <Splash />;
      }

      return (
        <RedirectRN
          push={push}
          to={generatePath(path, { ...profile.params, ...urlParams })}
        />
      );
    };
    return Redirect;
  };
}

let uncacheable = noop; // eslint-disable-line
if (!SSR_MODE) {
  uncacheable = open; // eslint-disable-line
}

let restrict = noop; // eslint-disable-line
if (!SSR_MODE) {
  restrict = (Component) => { // eslint-disable-line
    const Renderer = (props) => {
      const {
        user,
        error,
        route,
        profile,
        refetch,
      } = props;

      if (user.mock && error && error === 'Network error. Please check your internet connection.') {
        return <RedirectRN replace to={getUrl('/network-error')} />;
      }

      if (user.mock) {
        setTimeout(() => refetch());
        return <Splash />;
      }

      if (!profile || (route.permission && !profile[route.permission])) {
        return <RedirectRN replace to={getUrl('/404')} />;
      }

      return <Component {...props} />;
    };
    Renderer.displayName = Component.name;
    return Renderer;
  };
}

const tree = {
  component: open(Root),
  routes: [
    {
      key: 'Home',
      exact: true,
      path: getUrl('/'),
      component: open(Home),
      amp: true,
    },
    {
      key: 'About',
      exact: true,
      path: getUrl('/about'),
      component: open(About),
      amp: true,
    },
    {
      key: 'Login',
      exact: true,
      path: getUrl('/login'),
      component: open(Login),
    },
    {
      key: 'Signup',
      exact: true,
      path: getUrl('/signup'),
      component: open(Signup),
    },
    {
      key: 'Logout',
      exact: true,
      path: getUrl('/logout'),
      component: open(Logout),
    },
    {
      key: 'NetworkError',
      exact: true,
      path: getUrl('/network-error'),
      component: open(NetworkError),
      amp: true,
    },
    {
      key: 'UnknownError',
      exact: true,
      path: getUrl('/500'),
      component: open(UnknownError),
      amp: true,
    },
    {
      key: 'NotFound',
      exact: true,
      path: '*',
      component: open(NotFound),
      amp: true,
    },
  ],
};

routes.push(tree);
routes.index = {};
function createIndex(list) {
  list.forEach((route) => {
    routes.index[route.key] = route;
    if (route.routes) {
      createIndex(route.routes);
    }
  });
}
createIndex(routes);

routes.isAmp = (url) => {
  if (Platform.OS !== 'web') {
    return false;
  }
  if (reAmp.test(url)) {
    return true;
  }
  const matches = matchRoutes(routes, url);
  const current = last(matches);
  if (current && current.route && current.route.amp) {
    if (typeof current.route.amp === 'function') {
      return current.route.amp(url);
    }
    return true;
  }
  return false;
};

export default routes;
