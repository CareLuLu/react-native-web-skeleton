import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, withRouter } from 'react-router';
import { renderRoutes, matchRoutes } from 'react-router-config';
import { isSSR } from 'react-native-web-ui-components/utils';
import queryString from 'query-string';
import {
  last,
  omit,
  noop,
  intersection,
} from 'lodash';
import storage from '../utils/storage';
import { INITIAL_PAGE } from '../config';
import routes from './routes';
import Layout from '../components/Layout';

const paramRegex = /(:[a-zA-Z0-9_-]+)($|\/|\\|\?)/g;

let i = 0;

let shouldRedirect;
if (INITIAL_PAGE) {
  shouldRedirect = (location) => {
    if (i > 0 || location.pathname === INITIAL_PAGE) {
      return false;
    }
    i += 1;
    return true;
  };
} else {
  shouldRedirect = () => false;
}

const utmKeys = [
  'mkt',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

const allKeys = ['jwt'].concat(utmKeys);

const getUrlParams = ({ location }) => {
  const matches = matchRoutes(routes, location.pathname);
  const current = last(matches).route;
  const params = {};
  if (paramRegex.test(current.path)) {
    const paramNames = [];
    const pattern = current.path.replace(paramRegex, (match, $1, $2) => {
      paramNames.push($1.substring(1));
      return `([a-zA-Z0-9_-]*)${$2 === '/' ? $2 : ''}`;
    });
    const regex = new RegExp(`^${pattern}/?$`);
    const match = location.pathname.match(regex);
    paramNames.forEach((name, index) => {
      params[name] = '';
      if (match && match.length > index + 1) {
        params[name] = match[index + 1];
      }
    });
  }
  return params;
};

const EntryScreen = (props) => {
  const { location } = props;

  const params = {
    ...props,
    routes,
    urlParams: getUrlParams(props),
    hashParams: queryString.parse(location.hash),
    queryParams: queryString.parse(location.search),
  };

  const { queryParams } = params;
  const queryKeys = Object.keys(queryParams);

  if (!isSSR()) {
    if (queryParams.jwt) {
      storage.set('jwt', queryParams.jwt);
    }
    const utm = {};
    utmKeys.forEach((key) => {
      if (queryParams[key]) {
        utm[key.replace('utm_', '')] = queryParams[key];
      }
    });
    if (Object.keys(utm).length) {
      storage.set('utm', JSON.stringify(utm));
      storage.get('firstUtm').then((firstUtm) => {
        if (!firstUtm) {
          storage.set('firstUtm', JSON.stringify(utm));
        }
      }).catch(noop);
    }
  }

  if (!isSSR() && intersection(queryKeys, allKeys).length) {
    const search = queryString.stringify(omit(queryParams, allKeys));
    const url = `${location.pathname}${search ? `?${search}` : ''}${location.hash}`;
    return <Redirect replace to={url} />;
  }

  if (shouldRedirect(location)) {
    return <Redirect replace to={INITIAL_PAGE} />;
  }

  return (
    <Layout>
      {renderRoutes(routes, params)}
    </Layout>
  );
};

EntryScreen.propTypes = {
  location: PropTypes.shape().isRequired,
};

export default withRouter(EntryScreen);
