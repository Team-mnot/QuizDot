import axiosInstance from '@/shared/utils/axiosInstance';
import { baseApi } from '@/shared/apis';
import { ChannelInfos } from './types';

const url = 'lobby';

/*** 채널 목록 조회 ***/
async function getChannelsApi(): Promise<ChannelInfos> {
  const response = await axiosInstance.get(`${baseApi}/${url}/channel`);

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.data;
  else return { channelnfos: [] };
}

export { getChannelsApi };
