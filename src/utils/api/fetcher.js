// manage empty response during PUT or POST request
const readJsonResponse = async response => {
  try {
    return await response.json();
  } catch (e) {
    return {};
  }
};

export const fetcher = async (url, token, method, body) => {
  const headers = { Accept: 'application/json', 'Content-Type': 'application/json' };
  try {
    const response = await fetch(url, {
      headers: token ? { ...headers, Authorization: `Bearer ${token}` } : headers,
      method,
      body: body ? JSON.stringify(body) : null,
    });
    const { ok, status, statusText } = response;
    if (ok) {
      try {
        const data = await readJsonResponse(response);
        return { data, status, statusText };
      } catch (error) {
        return { error: true, status, statusText: error.message };
      }
    } else {
      return { error: true, status, statusText };
    }
  } catch (error) {
    // network error
    return { error: true, statusText: error.message };
  }
};

export const getFetcherForLunatic = token => (url, options) => {
  const otherHeader = options?.headers || {};
  return fetch(url, {
    ...options,
    headers: token ? { ...otherHeader, Authorization: `Bearer ${token}` } : otherHeader,
  }).then(r => r.json());
};
