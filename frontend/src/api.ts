type ApiOptions = RequestInit & {
  auth?: boolean;
};

const getAuthToken = () => localStorage.getItem('authToken');

const apiRequest = async <ResponseBody>(
  path: string,
  options: ApiOptions = {},
) => {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.auth) {
    const token = getAuthToken();

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(path, {
    ...options,
    headers,
  });
  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data as ResponseBody;
};

export { apiRequest, getAuthToken };
