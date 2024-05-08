import axios from 'axios';
import qs from 'qs';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  headers: {
    accept: 'application/json;charset=UTF-8',
  },
});

axiosInstance.defaults.paramsSerializer = (params) => {
  return qs.stringify(params);
};

export default axiosInstance;
