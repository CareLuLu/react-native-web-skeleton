import Cookies from 'js-cookie';

const params = { path: '/' };

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
