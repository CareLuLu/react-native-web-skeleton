import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { NetworkErrorLink, cacheFirstNetworkErrorLink } from 'apollo-link-network-error';
import { GRAPHQL_URL } from '../../config';
import storage from '../storage';
import getPlatform from '../getPlatform';
import { dasherize } from '../string';
import { waitFor } from '../wait';

/* eslint no-param-reassign: 0 */

const cacheErrorRegex = /^Can't find field /i;

const state = {
  client: null,
};

const customFetch = (ssrMode, ip, memoryCache) => {
  if (!ssrMode) {
    return async (uri, options) => {
      const [
        jwt,
        distinctId,
        utm,
        firstUtm,
        page,
        landingPage,
        firstLandingPage,
        schoolId,
      ] = await Promise.all([
        storage.get('jwt'),
        storage.get('distinctId'),
        storage.get('utm'),
        storage.get('firstUtm'),
        storage.get('page'),
        storage.get('landingPage'),
        storage.get('firstLandingPage'),
        storage.get('schoolId'),
      ]);
      options.mode = 'cors';
      options.headers.Authorization = `Bearer ${jwt}`;
      if (distinctId) {
        options.headers['x-carelulu-f'] = distinctId;
      }
      if (schoolId) {
        options.headers['x-carelulu-s'] = schoolId;
      }
      const parsedUtm = JSON.parse(utm || '{}');
      Object.keys(parsedUtm).forEach((key) => {
        options.headers[`x-carelulu-${dasherize(key)}`] = parsedUtm[key];
      });
      const parsedFirstUtm = JSON.parse(firstUtm || '{}');
      Object.keys(parsedFirstUtm).forEach((key) => {
        options.headers[`x-carelulu-first-${dasherize(key)}`] = parsedFirstUtm[key];
      });
      if (page) {
        options.headers['x-carelulu-page'] = page;
      }
      if (landingPage) {
        options.headers['x-carelulu-landing-page'] = landingPage;
      }
      if (firstLandingPage) {
        options.headers['x-carelulu-first-landing-page'] = firstLandingPage;
      }
      options.headers['x-carelulu-platform'] = getPlatform();
      if (ip) {
        options.headers['x-forwarded-for'] = ip;
      }
      const response = await fetch(uri, options);
      const promises = [];
      const responseDistinctId = response.headers.get('x-carelulu-f');
      if (responseDistinctId) {
        promises.push(storage.set('distinctId', responseDistinctId));
      }
      const responseJwt = response.headers.get('x-carelulu-b');
      if (responseJwt) {
        promises.push(storage.set('jwt', responseJwt));
      }
      await Promise.all(promises);

      if (responseJwt && jwt !== responseJwt && state.client) {
        // We must reset the store after all requests have resolved.
        setTimeout(() => state.client.clearStore());
      }
      return response;
    };
  }
  return async (uri, options) => {
    options.headers['x-forwarded-for'] = ip;
    const response = await fetch(uri, options);
    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      const maxAge = parseInt(cacheControl.split('=')[1], 10);
      let previousMaxAge = memoryCache.data.get('cacheControl');
      if (previousMaxAge === null || previousMaxAge === undefined) {
        previousMaxAge = maxAge;
      }
      memoryCache.data.set('cacheControl', Math.min(parseInt(previousMaxAge, 10), maxAge));
    }
    return response;
  };
};

const createClient = (ssrMode, cache = {}, ip) => {
  if (!ssrMode && state.client) {
    return state.client;
  }

  const memoryCache = new InMemoryCache({
    possibleTypes: {
      paymentMethod: ['bankAccount', 'card'],
    },
  }).restore(cache);
  const errorLink = new NetworkErrorLink(({ networkError }) => {
    if (cacheErrorRegex.test(networkError.message)) {
      throw new Error('Network error. Please check your internet connection.');
    }
    throw networkError;
  });
  const errorIgnoreLink = cacheFirstNetworkErrorLink(memoryCache);
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    fetch: customFetch(ssrMode, ip, memoryCache, state),
  });

  const link = ApolloLink.from([
    errorLink,
    errorIgnoreLink,
    httpLink,
  ]);

  state.client = new ApolloClient({
    ssrMode,
    link,
    cache: memoryCache,
    errorPolicy: 'all',
    shouldBatch: !ssrMode,
    connectToDevTools: true,
  });
  state.client.getCacheData = () => state.client.cache.data.data;

  const { clearStore } = state.client;
  state.client.clearStore = async (...args) => {
    const { queryManager } = state.client;
    await waitFor(() => {
      // This is a hack. Apollo gives no interface
      // to see how many queries are currently in flight. At
      // the same time, if we call clearStore with queries in
      // flight, all these in-flight queries will throw errors.
      const { fetchQueryRejectFns } = queryManager;
      return (!fetchQueryRejectFns || !fetchQueryRejectFns.size);
    });
    const result = await clearStore.call(state.client, ...args);
    return result;
  };

  const { query } = state.client;
  state.client.query = options => query.call(state.client, {
    ...options,
    context: {
      __skipErrorAccordingCache__: options.fetchPolicy !== 'network-only',
    },
  });

  return state.client;
};

export const getClient = () => state.client;

export default createClient;
