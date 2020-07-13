import { Platform } from 'react-native';
import { URL } from '../../config';

const domain = URL.replace(/^https?:\/\//, '');
let prefix = domain.indexOf('/') >= 0
  ? domain.substring(domain.indexOf('/'))
  : '';

if (prefix && prefix[prefix.length - 1] === '/') {
  prefix = prefix.substring(0, prefix.length - 1);
}

if (Platform.OS !== 'web') {
  prefix = '';
}

const getUrl = pathname => `${prefix}${pathname}`;

export default getUrl;
