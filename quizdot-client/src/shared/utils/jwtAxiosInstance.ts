import axios from 'axios';
import qs from 'qs';

const jwtAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

jwtAxiosInstance.interceptors.request.use(
  function (config) {
    //    const token = localStorage.getItem('accessToken');
    const token =
      'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MjEsImNhdGVnb3J5IjoiYWNjZXNzIiwibWVtYmVySWQiOiIzN2pzYmVhbiIsInJvbGUiOiJST0xFX1VTRVIiLCJuaWNrbmFtZSI6InN1YmluIiwiaWF0IjoxNzE1MzU0MTY2LCJleHAiOjE3MTUzNjQ5NjZ9.UQBcryryX6MIat9P1t3G0RDGjUGSg9bSQj0_XpIX-cM';
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
