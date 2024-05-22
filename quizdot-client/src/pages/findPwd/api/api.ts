import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { FindPwdProps, Response } from './types';

export async function FindPwdApi(props: FindPwdProps): Promise<boolean> {
  try {
    const response: AxiosResponse<Response> = await axios.post(
      `${baseApi}/member`,
      props,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status === 200) {
      return true;
    }
  } catch (error) {
    console.error('Error Find Password', error);
    return false;
  }
  return false;
}
