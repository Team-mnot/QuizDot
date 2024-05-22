import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { baseApi } from '../apis';

const jwtAxiosInstance = axios.create({
  baseURL: baseApi,
  timeout: 60000,
  withCredentials: true,
  headers: {
    accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

const refresh = async () => {
  const response = await jwtAxiosInstance.post(`${baseApi}/member/reissue`);
  return response;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const beforeRes = async (response: AxiosResponse): Promise<any> => {
  const data = response.data;

  // access token 문제가 있다면
  if (data.status === 401) {
    // access token 가져오고
    const token = localStorage.getItem('accessToken');
    // 없으면 종료
    if (!token) {
      console.log('accessToken not found');
      return;
    }
    // 재발급 신청하고
    const NewToken = await refresh();
    if (NewToken.status === 200) {
      // 재발급 되면 갱신
      const accessToken = NewToken.headers.access;
      localStorage.setItem('accessToken', accessToken);
      return response;
    }
  }
  return response;
};
/* eslint-disable @typescript-eslint/no-explicit-any */

jwtAxiosInstance.interceptors.response.use(beforeRes, function (error) {
  return Promise.reject(error);
});

jwtAxiosInstance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem('accessToken');
    config.headers.access = `${token}`;
    return config;
  },

  function (error) {
    return Promise.reject(error);
  },
);

jwtAxiosInstance.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

export default jwtAxiosInstance;
