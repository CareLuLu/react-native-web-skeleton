import { ApolloClient } from '@apollo/client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { NAME, GRAPHQL_URL } from '../../config';
import storage from '../storage';
import getPlatform from '../getPlatform';
import { dasherize } from '../string';
import { waitFor } from '../wait';

/* eslint no-param-reassign: 0 */

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
      ] = await Promise.all([
        storage.get('jwt'),
        storage.get('distinctId'),
        storage.get('utm'),
        storage.get('firstUtm'),
        storage.get('page'),
        storage.get('landingPage'),
        storage.get('firstLandingPage'),
      ]);
      const appName = dasherize(NAME.toLowerCase());

      options.mode = 'cors';
      options.headers.Authorization = `Bearer ${jwt}`;
      if (distinctId) {
        options.headers[`x-${appName}-f`] = distinctId;
      }
      const parsedUtm = JSON.parse(utm || '{}');
      Object.keys(parsedUtm).forEach((key) => {
        options.headers[`x-${appName}-${dasherize(key)}`] = parsedUtm[key];
      });
      const parsedFirstUtm = JSON.parse(firstUtm || '{}');
      Object.keys(parsedFirstUtm).forEach((key) => {
        options.headers[`x-${appName}-first-${dasherize(key)}`] = parsedFirstUtm[key];
      });
      if (page) {
        options.headers[`x-${appName}-page`] = page;
      }
      if (landingPage) {
        options.headers[`x-${appName}-landing-page`] = landingPage;
      }
      if (firstLandingPage) {
        options.headers[`x-${appName}-first-landing-page`] = firstLandingPage;
      }
      options.headers[`x-${appName}-platform`] = getPlatform();
      if (ip) {
        options.headers['x-forwarded-for'] = ip;
      }
      const response = await fetch(uri, options);
      const promises = [];
      const responseDistinctId = response.headers.get(`x-${appName}-f`);
      if (responseDistinctId) {
        promises.push(storage.set('distinctId', responseDistinctId));
      }
      const responseJwt = response.headers.get(`x-${appName}-b`);
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
  const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData: {
      __schema: {
        types: [{
          kind: 'INTERFACE',
          name: 'paymentMethod',
          possibleTypes: [
            { name: 'bankAccount' },
            { name: 'card' },
          ],
        }],
      },
    },
  });
  const memoryCache = new InMemoryCache({ fragmentMatcher }).restore(cache);
  state.client = new ApolloClient({
    ssrMode,
    cache: memoryCache,
    link: createHttpLink({
      uri: GRAPHQL_URL,
      fetch: customFetch(ssrMode, ip, memoryCache, state),
    }),
    errorPolicy: 'all',
    shouldBatch: !ssrMode,
    connectToDevTools: true,
  });
  state.client.getCacheData = () => state.client.store.cache.data.data;

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

  return state.client;
};

export const getClient = () => state.client;

export default createClient;
