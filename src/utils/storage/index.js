import { AsyncStorage } from 'react-native';

async function set(key, value) {
  return AsyncStorage.setItem(key, value);
}

async function get(key) {
  return AsyncStorage.getItem(key);
}

async function remove(key) {
  return AsyncStorage.removeItem(key);
}

const storage = { set, get, remove };

export default storage;
