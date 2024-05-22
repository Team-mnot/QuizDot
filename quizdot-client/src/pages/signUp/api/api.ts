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

export async function IdCheckApi(props: string): Promise<boolean> {
  try {
    const response: AxiosResponse<Response> = await axios.get(
      `${baseApi}/member/check-id?id=${props}`,
    );
    if (response.data.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error Id Check', error);
    return false;
  }
}

export async function NicknameCheckApi(props: string): Promise<boolean> {
  try {
    const response: AxiosResponse<Response> = await axios.get(
      `${baseApi}/member/check-nickname?nickname=${props}`,
    );
    if (response.data.status === 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error Id Check', error);
    return false;
  }
}
