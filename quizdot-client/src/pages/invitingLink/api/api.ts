import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { Response } from '@/shared/apis/types';

const url = 'room';

/*** 초대 링크로 게임 대기실 입장 ***/
async function enterRoomWithLinkApi(invitingLink: string): Promise<Response> {
  const apiUrl = `${baseApi}/${url}/invite?data=${invitingLink}`;
  try {
    const response = await jwtAxiosInstance.get(apiUrl);
    console.log('enterRoomWithLinkApi is successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error to enterRoomWithLinkApi:', error);
    throw new Error('Failed to enterRoomWithLinkApi');
  }
}

export { enterRoomWithLinkApi };
