import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { LogInProps, Response } from './types';

export async function LogInApi(props: LogInProps): Promise<void> {
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
      },
    );
    console.log(response);
    if (response.status === 200) {
      console.log('로그인 성공');
      window.alert('로그인 성공');
      // 로그인
    }
  } catch (error) {
    console.error('Error LogIn', error);
  }
}
