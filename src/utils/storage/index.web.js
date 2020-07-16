import Cookies from 'js-cookie';
import { isSSR } from 'react-native-web-ui-components/utils';
import { COOKIE_DOMAIN } from '../../config';

const params = { path: '/' };
if (!isSSR() && COOKIE_DOMAIN) {
  params.domain = COOKIE_DOMAIN;
}

async function set(key, value) {
  Cookies.set(key, value, {
    ...params,
    expires: 31536000,
  });
}

async function get(key) {
  return Cookies.get(key);
}

async function remove(key) {
  return Cookies.remove(key, params);
}

const storage = { set, get, remove };

export default storage;
