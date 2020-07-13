import { each } from 'lodash';

const strip = /[:?]/g;
const re = /:([^/:-?]+\??)/g;

const generatePath = (path, params) => {
  let url = path || '';
  let notFound = false;
  const matches = url.match(re);
  if (matches && matches.length) {
    each(matches, (m) => {
      const val = params[m.replace(strip, '')];
      if (val !== undefined) {
        url = url.replace(m, val);
      } else {
        notFound = true;
      }
    });
  }
  if (re.test(url)) {
    notFound = true;
  }
  if (notFound) {
    url = '/404';
  }
  return url;
};

export default generatePath;
