import axios from 'axios';
import qs from 'qs';

const jwtAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    accept: 'application/json;charset=UTF-8',
  },
});

jwtAxiosInstance.interceptors.request.use(
  function (config) {
    //const token = localStorage.getItem('accessToken');
    const token =
      'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MjEsImNhdGVnb3J5IjoiYWNjZXNzIiwibWVtYmVySWQiOiIzN2pzYmVhbiIsInJvbGUiOiJST0xFX1VTRVIiLCJuaWNrbmFtZSI6InN1YmluIiwiaWF0IjoxNzE1Mjk5MzU4LCJleHAiOjE3MTUzMTAxNTh9.ToKy6hQvZVDtgFXG2o3qhvFFyNCpW4JR3WJ4aoIxLss';
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
