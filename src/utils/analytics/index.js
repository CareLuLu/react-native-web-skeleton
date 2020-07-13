import { isSSR } from 'react-native-web-ui-components/utils';
import { pickBy } from 'lodash';
import { GOOGLE_ANALYTICS_ID } from '../../config';
import { getClient } from '../apollo/createClient';
import getPlatform from '../getPlatform';
import USER_TRACK from '../../graphql/userTrack';

/* eslint no-await-in-loop: 0 */

const backlog = [];

const delay = async miliseconds => new Promise(resolve => setTimeout(() => resolve(), miliseconds));

const trackUntil = async (options) => {
  let nextOptions = null;
  try {
    // Add to the queue of events.
    backlog.push(options);

    do {
      // Pull first event to be tracked.
      nextOptions = backlog.shift();
      const { params, mutation } = nextOptions;

      // Try to track the event.
      await getClient().mutate({
        mutation,
        variables: { params },
      });

      // Mark as tracked.
      nextOptions = null;

      // Wait 100 milliseconds before sending the next event.
      await delay(100);
    } while (backlog.length);
  } catch (err) {
    // If there is an error and the event hasn't been tracked,
    // we add the event back to the queue.
    if (nextOptions) {
      backlog.unshift(nextOptions);
    }
  }
};

export const trackApi = ({ entry }) => {
  if (isSSR()) {
    return null;
  }

  const params = pickBy({
    action: entry.action,
    label: entry.label,
    category: entry.category,
    platform: getPlatform(),
  }, v => (v !== undefined));

  return trackUntil({
    params,
    mutation: USER_TRACK,
  });
};

export const trackGoogleAnalytics = async ({ entry = {} }) => {
  try {
    if (entry.category === 'PAGE VIEW') {
      window.gtag('config', GOOGLE_ANALYTICS_ID, {
        page_path: entry.label,
        page_title: document.title,
      });
    } else {
      window.gtag('event', entry.action, {
        event_category: entry.category,
        event_label: entry.label,
      });
    }
  } catch (err) {
    // ignore
  }
};

export const track = async (...args) => Promise.all([
  trackApi(...args),
  trackGoogleAnalytics(...args),
]);

export const trackPageView = async ({ entry = {}, ...options }) => track({
  ...options,
  entry: {
    ...entry,
    action: 'PAGE VIEW',
    category: getPlatform().toUpperCase().replace('-', ' '),
  },
});

export const trackCallToAction = async ({ entry = {}, ...options }) => track({
  ...options,
  entry: {
    ...entry,
    category: 'CALL TO ACTION',
  },
});
