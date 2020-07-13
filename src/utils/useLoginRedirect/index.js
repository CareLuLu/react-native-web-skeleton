import queryString from 'query-string';

const useLoginRedirect = ({ location, history }) => {
  const { search, pathname } = location;

  const redirect = () => {
    const query = queryString.parse(search);
    const regex = new RegExp(`^${pathname.replace(/\//g, '\\/')}`);
    let url = query.redirect && decodeURIComponent(query.redirect);
    if (!url || regex.test(url)) {
      url = '/';
    }
    history.clear();
    history.replace(url);
  };

  return redirect;
};

export default useLoginRedirect;
