import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import axiosInstance from '@/shared/utils/axiosInstance';
import { baseApi } from '@/shared/apis';
import { CheckPasswordInfo, CreatingRoomInfo, LobbyInfo } from './types';

const url = 'lobby';

/*** 대기실 생성 ***/
export async function createRoomApi(
  channelId: number,
  request: CreatingRoomInfo,
): Promise<CheckPasswordInfo> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/channel/${channelId}`,
    request,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);

  if (response.data.status == 200) return response.data.data;
  else
    return {
      roomNum: -1,
      password: '',
    };
}

/*** 채널 로비 입장 ***/
export async function enterLobbyApi(channelId: number): Promise<LobbyInfo> {
  const response = await jwtAxiosInstance.get(
    `${baseApi}/${url}/channel/${channelId}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);

  if (response.data.status == 200) return response.data.data;
  else
    return {
      channelId: -1,
      activeUserDtos: [],
      roomInfoDtos: [],
    };
}

/*** 비공개 방 비밀번호 확인 ***/
export async function checkPasswordApi(
  roomId: number,
  password: string,
): Promise<boolean> {
  const response = await axiosInstance.post(
    `${baseApi}/${url}/channel/${roomId}/pwd-check`,
    password,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data.status;
}
