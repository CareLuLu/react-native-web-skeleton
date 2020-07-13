import { merge } from 'lodash';

const useComposed = (results = []) => {
  const result = {
    data: null,
    error: null,
    loading: false,
    refetchs: [],
  };
  result.refetch = () => result.refetchs.map(refetch => refetch());

  results.forEach(({
    data,
    error,
    loading,
    refetch,
  }) => {
    result.error = result.error || error;
    result.loading = result.loading || loading;
    if (result.refetchs.indexOf(refetch) < 0) {
      result.refetchs.push(refetch);
    }
    if (data) {
      result.data = result.data || {};
      merge(result.data, data);
    }
  });

  return result;
};

export default useComposed;
