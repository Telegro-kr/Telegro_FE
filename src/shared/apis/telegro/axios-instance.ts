import { toastError } from '@components/common/toast/toast';
import Axios, { AxiosRequestConfig } from 'axios';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isHandlingUnauthorized = false;
let isHandlingServerFailure = false;

const GLOBAL_AUTH_ERROR_TOAST_KEY = 'global-auth-error-toast';
const GLOBAL_AUTH_ERROR_MESSAGE =
  '네트워크 오류가 발생했습니다.\n다시 로그인해주세요.';

export const consumeGlobalAuthErrorToast = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const message = window.sessionStorage.getItem(GLOBAL_AUTH_ERROR_TOAST_KEY);

  if (!message) {
    return null;
  }

  window.sessionStorage.removeItem(GLOBAL_AUTH_ERROR_TOAST_KEY);
  return message;
};

const redirectToHomeWithAuthError = () => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('userRole');
  window.sessionStorage.setItem(
    GLOBAL_AUTH_ERROR_TOAST_KEY,
    GLOBAL_AUTH_ERROR_MESSAGE,
  );

  if (window.location.pathname === '/') {
    toastError(GLOBAL_AUTH_ERROR_MESSAGE);
    window.setTimeout(() => {
      isHandlingServerFailure = false;
    }, 1000);
    return;
  }

  window.location.replace('/');
};

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const code = error?.code;
    const requestUrl = String(error?.config?.url ?? '');
    const isAuthRequest =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/signup');
    const isNetworkError = code === 'ERR_NETWORK' && !error?.response;
    const isServerError = typeof status === 'number' && status >= 500;

    if (status === 401 && !isAuthRequest && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userRole');

      if (!isHandlingUnauthorized) {
        isHandlingUnauthorized = true;
        window.location.replace('/');
      }
    }

    if ((isNetworkError || isServerError) && typeof window !== 'undefined') {
      if (!isHandlingServerFailure) {
        isHandlingServerFailure = true;
        redirectToHomeWithAuthError();
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
