import axios from 'axios';
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
