import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { SignUpProps, Response } from './types';

export async function SignUpApi(props: SignUpProps): Promise<void> {
  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/join`,
      props,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status === 200) {
      console.log('회원가입 성공');
      window.alert('회원가입 성공');
      // 로그인
    }
  } catch (error) {
    console.error('Error SignUp', error);
  }
}
