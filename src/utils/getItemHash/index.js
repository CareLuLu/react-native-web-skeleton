import { each, isArray, isPlainObject } from 'lodash';

const getItemHash = (item) => {
  const source = item || {};
  let hash = `${source.id}:${source.updatedAt}`;
  each(source, (v, k) => {
    if (isPlainObject(v)) {
      hash += `:${k}:{${getItemHash(v)}}`;
    } else if (isArray(v)) {
      hash += `:${k}:[${getItemHash(v)}]`;
    }
  });
  return hash;
};

export default getItemHash;
