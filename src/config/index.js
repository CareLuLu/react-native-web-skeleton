import {
  REACT_APP_NAME,
  REACT_APP_URL,
  REACT_APP_API_URL,
  REACT_APP_GRAPHQL_URL,
  REACT_APP_RESOURCE_URL,
  REACT_APP_POLLING_INTERVAL,
  REACT_APP_GOOGLE_ANALYTICS_ID,
  REACT_APP_FOOTER_DISCLAIMER,
  REACT_APP_SIGNUP_DISCLAIMER,
  REACT_APP_COOKIE_DOMAIN,
  REACT_APP_INITIAL_PAGE,
} from 'react-native-dotenv';

/* eslint import/no-extraneous-dependencies: 0 */
/* eslint import/prefer-default-export:0 */

export const NAME = (
  process.env.REACT_APP_NAME
  || REACT_APP_NAME
  || 'BaseApp'
);
export const URL = (
  process.env.REACT_APP_URL
  || REACT_APP_URL
  || 'https://www.baseapp.com'
);
export const API_URL = (
  process.env.REACT_APP_API_URL
  || REACT_APP_API_URL
  || 'https://www.baseapp.com/api'
);
export const GRAPHQL_URL = (
  process.env.REACT_APP_GRAPHQL_URL
  || REACT_APP_GRAPHQL_URL
  || 'https://www.baseapp.com/graphql'
);
export const RESOURCE_URL = (
  process.env.REACT_APP_RESOURCE_URL
  || REACT_APP_RESOURCE_URL
  || '/static'
);
export const POLLING_INTERVAL = (
  parseInt(process.env.REACT_APP_POLLING_INTERVAL, 10)
  || parseInt(REACT_APP_POLLING_INTERVAL, 10)
  || 5000
);
export const GOOGLE_ANALYTICS_ID = (
  process.env.REACT_APP_GOOGLE_ANALYTICS_ID
  || REACT_APP_GOOGLE_ANALYTICS_ID
  || 'not-working-id'
);
export const FOOTER_DISCLAIMER = (
  process.env.REACT_APP_FOOTER_DISCLAIMER
  || REACT_APP_FOOTER_DISCLAIMER
  || 'Made with ❤ by [BaseApp](https://www.baseapp.com)'
);
export const SIGNUP_DISCLAIMER = (
  process.env.REACT_APP_SIGNUP_DISCLAIMER
  || REACT_APP_SIGNUP_DISCLAIMER
  || 'By signing up, you agree to create an account at [BaseApp](https://www.baseapp.com).'
);
export const COOKIE_DOMAIN = (
  process.env.REACT_APP_COOKIE_DOMAIN
  || REACT_APP_COOKIE_DOMAIN
  || ''
);

// For testing. If set, the app will start at the page below.
export const INITIAL_PAGE = process.env.REACT_APP_INITIAL_PAGE || REACT_APP_INITIAL_PAGE;
