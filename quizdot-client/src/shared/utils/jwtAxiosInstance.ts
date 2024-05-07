import axios, { InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';

const jwtAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

const beforeRequest = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: InternalAxiosRequestConfig<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): InternalAxiosRequestConfig<any> | Promise<any> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.log('ACCESS TOKEN NOT FOUNT');

    return Promise.reject({
      response: { status: 401, data: { message: '로그인이 필요합니다.' } },
    });
  }

  // Authorization 헤더 처리
  config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;

  return config;
};

jwtAxiosInstance.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

jwtAxiosInstance.interceptors.request.use(beforeRequest);

export default jwtAxiosInstance;
