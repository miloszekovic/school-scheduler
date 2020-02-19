export const API_URL = (url => {
  if (!url) {
    throw new Error('API_URL is not configured');
  }

  if (url[url.length - 1] === '/') {
    url = url.slice(0, -1);
  }

  return url;
})(process.env.REACT_APP_API_URL);
