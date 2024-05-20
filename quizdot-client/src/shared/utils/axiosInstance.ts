import axios from 'axios';
import qs from 'qs';
import { baseApi } from '../apis';

const axiosInstance = axios.create({
  baseURL: baseApi,
  timeout: 60000,
  headers: {
    accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

axiosInstance.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

export default axiosInstance;
