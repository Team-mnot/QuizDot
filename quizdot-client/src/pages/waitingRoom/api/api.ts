import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import {
  EnteringRoomType,
  ModifyingRoomType,
  WaitingRoomResponse,
} from './types';

const url = 'room';

/*** 게임 대기실 입장 ***/
async function EnterRoomApi(roomId: number): Promise<EnteringRoomType> {
  const response = await jwtAxiosInstance.get(`${baseApi}/${url}/${roomId}`);

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.data;
  else
    return {
      players: {},
      roomInfo: {
        roomId: -1,
        title: '',
        password: '',
        gameMode: '',
        maxPeople: -1,
        category: '',
        maxQuestion: -1,
        hostId: -1,
        open: true,
        inviteLink: null,
        state: 'WAITING',
      },
    };
}

/*** 게임 대기실 퇴장 ***/
async function LeaveRoomApi(roomId: number): Promise<number> {
  const response = await jwtAxiosInstance.delete(`${baseApi}/${url}/${roomId}`);

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data.status;
}

/*** 게임 대기실 정보 변경 ***/
async function ModifyRoomApi(
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
async function InviteRoomWithLinkApi(
  roomId: number,
): Promise<WaitingRoomResponse> {
  const response = await jwtAxiosInstance.get(
    `${baseApi}/${url}/${roomId}/invite`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data;
}

export { EnterRoomApi, LeaveRoomApi, ModifyRoomApi, InviteRoomWithLinkApi };
