import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { LogInProps, Response, UserInfo } from './types';

axios.interceptors.response.use(
  function (response) {
    const accessToken = response.headers.access;
    localStorage.setItem('accessToken', accessToken);
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export async function LogInApi(props: LogInProps): Promise<UserInfo | null> {
  try {
    const formData = new FormData();
    formData.append('memberId', props.memberId);
    formData.append('password', props.password);

    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/login`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      },
    );

    if (response.status === 200) {
      console.log('로그인 성공');
      window.alert('로그인 성공');
      return response.data.data;
    }
  } catch (error) {
    console.error('Error LogIn', error);
    return null;
  }
  return null;
}
