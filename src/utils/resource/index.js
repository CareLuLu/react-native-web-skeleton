import { RESOURCE_URL } from '../../config';

const protocolRegex = /^https?:\/\//;

const resource = (pathname) => {
  if (protocolRegex.test(pathname)) {
    return pathname;
  }
  return `${RESOURCE_URL}${pathname}`;
};

export default resource;
