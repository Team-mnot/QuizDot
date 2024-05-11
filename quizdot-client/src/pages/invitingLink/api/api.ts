import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { InvitingLinkResponse } from './types';

const url = 'room';

/*** 초대 링크로 게임 대기실 입장 ***/
async function EnterRoomWithLinkApi(
  invitingLink: string,
): Promise<InvitingLinkResponse> {
  const response = await jwtAxiosInstance.get(
    `${baseApi}/${url}/invite/data=${invitingLink}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data;
}

export { EnterRoomWithLinkApi };
