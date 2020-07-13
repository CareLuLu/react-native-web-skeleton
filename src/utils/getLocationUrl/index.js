const getLocationUrl = location => `${location.pathname}${location.search || ''}${location.hash || ''}`;

export default getLocationUrl;
