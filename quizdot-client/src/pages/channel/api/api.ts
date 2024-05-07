import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { channelInfo } from './types';

const url = 'lobby';

/*** 채널 목록 조회 ***/
export async function getChannelsApi(): Promise<channelInfo[]> {
  try {
    const response = await jwtAxiosInstance.post(`${baseApi}/${url}/channel`);
    console.log('[채널 목록 조회 성공] : ', response);
    return response.data.data;
  } catch (error) {
    console.error('[채널 목록 조회 실패] : ', error);
    throw error;
  }
}
