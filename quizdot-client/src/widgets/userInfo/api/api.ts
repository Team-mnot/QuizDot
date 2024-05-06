import axios, { AxiosResponse } from 'axios';
import { baseApi } from '@/shared/apis';
import type { Response, UserInfo } from './types';

export async function GetUserInfoApi(props: number): Promise<UserInfo | null> {
  try {
    const response: AxiosResponse<Response> = await axios.get(
      `${baseApi}/member/info/${props}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status === 200) {
      return response.data.data!;
    }
  } catch (error) {
    console.error('Error Get UserInfo', error);
  }
  return null;
}
