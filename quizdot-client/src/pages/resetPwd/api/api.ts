import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { ResetPwdProps, Response } from './types';

export async function ResetPwdApi(props: ResetPwdProps): Promise<boolean> {
  console.log('들어옴');
  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member/pwd`,
      {
        memberId: props.memberId,
        password: props.password,
        passwordChk: props.passwordChk,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response);
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error('Error Reset Password', error);
    return false;
  }
  return false;
}
