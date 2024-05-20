import axiosInstance from '@/shared/utils/axiosInstance';
import { baseApi } from '@/shared/apis';
import type { UserInfo } from './types';

export async function GetUserInfoApi(props: number): Promise<UserInfo | null> {
  try {
    const response = await axiosInstance.get(
      `${baseApi}/member/info/${props}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
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
