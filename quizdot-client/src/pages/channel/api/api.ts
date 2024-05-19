import axiosInstance from '@/shared/utils/axiosInstance';
import { baseApi } from '@/shared/apis';
import { ChannelInfosType } from './types';

const url = 'lobby';

/*** 채널 목록 조회 ***/
async function getChannelsApi(): Promise<ChannelInfosType> {
  const apiUrl = `${baseApi}/${url}/channel`;
  try {
    const response = await axiosInstance.get(apiUrl);
    console.log('getChannelsApi is successfully:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error to getChannelsApi:', error);
    throw new Error('Failed to getChannelsApi');
  }
}

export { getChannelsApi };
