import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { ModifyingRoomType } from './types';
import { Response } from '@/shared/apis/types';

const url = 'room';

/*** 게임 대기실 입장 ***/
async function enterRoomApi(roomId: number): Promise<Response> {
  const response = await jwtAxiosInstance.get(`${baseApi}/${url}/${roomId}`);

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data;
}

/*** 게임 대기실 퇴장 ***/
async function leaveRoomApi(roomId: number): Promise<number> {
  const response = await jwtAxiosInstance.delete(`${baseApi}/${url}/${roomId}`);

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data.status;
}

/*** 게임 대기실 정보 변경 ***/
async function modifyRoomApi(
  roomId: number,
  modifyingRoom: ModifyingRoomType,
): Promise<number> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/${roomId}`,
    modifyingRoom,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.status;
}

/*** 초대 링크 생성 ***/
async function inviteRoomWithLinkApi(roomId: number): Promise<Response> {
  const response = await jwtAxiosInstance.get(
    `${baseApi}/${url}/${roomId}/invite`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data;
}

export { enterRoomApi, leaveRoomApi, modifyRoomApi, inviteRoomWithLinkApi };
