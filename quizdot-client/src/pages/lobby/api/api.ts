import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { CreatingRoomType, LobbyInfoType, LobbyResponse } from './types';

const url = 'lobby';

/*** 게임 대기실 생성 ***/
async function createRoomApi(
  channelId: number,
  creatingRoomInfo: CreatingRoomType,
): Promise<LobbyResponse> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/channel/${channelId}`,
    creatingRoomInfo,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data;
}

/*** 채널 로비 입장 ***/
async function enterLobbyApi(channelId: number): Promise<LobbyInfoType> {
  const response = await jwtAxiosInstance.get(
    `${baseApi}/${url}/channel/${channelId}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200)
    return {
      channelId: response.data.data.channelId,
      activeUsers: response.data.data.activeUserDtos,
      roomInfos: response.data.data.roomInfoDtos,
    };
  else
    return {
      channelId: -1,
      activeUsers: [],
      roomInfos: [],
    };
}

/*** 비공개 방 비밀번호 확인 ***/
async function checkRoomPwdApi(
  roomId: number,
  password: string,
): Promise<number> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/${roomId}/pwd-check`,
    password,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data.status;
}

export { createRoomApi, enterLobbyApi, checkRoomPwdApi };
