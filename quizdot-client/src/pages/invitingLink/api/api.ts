import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { Response } from '@/shared/apis/types';

const url = 'room';

/*** 초대 링크로 게임 대기실 입장 ***/
async function enterRoomWithLinkApi(invitingLink: string): Promise<Response> {
  const response = await jwtAxiosInstance.get(
    `${baseApi}/${url}/invite/data=${invitingLink}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data;
}

export { enterRoomWithLinkApi };
