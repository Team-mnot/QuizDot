import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { SignUpProps, Response } from './types';

export async function SignUpApi(
  props: SignUpProps,
): Promise<'success' | 'fail'> {
  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/join`,
      {
        memberId: props.memberId,
        password: props.password,
        nickname: props.nickname,
        hint: props.hint,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status === 200) {
      window.alert('회원가입 성공');
      return 'success';
    }
  } catch (error) {
    console.error('Error SignUp', error);
    return 'fail';
  }
  return 'fail';
}
