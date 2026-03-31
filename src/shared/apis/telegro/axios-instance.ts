import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isHandlingUnauthorized = false;

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = String(error?.config?.url ?? '');
    const isAuthRequest =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/signup');

    if (status === 401 && !isAuthRequest && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');

      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        window.location.replace('/');
      }
    }

    return Promise.reject(error);
  },
);

export const axiosInstance = async <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    cancelToken: source.token,
    ...config,
    ...options,
  }).then(({ data }) => data);
  // @ts-ignore: react-query cancel 지원
  promise.cancel = () => source.cancel('Query was cancelled');
  return promise;
};

export type ErrorType<Error> = import('axios').AxiosError<Error>;
export type BodyType<BodyData> = BodyData;
