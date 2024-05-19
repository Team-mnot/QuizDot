import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { ModifyingRoomType } from './types';
import { Response } from '@/shared/apis/types';

const url = 'room';

/*** 게임 대기실 입장 ***/
async function enterRoomApi(roomId: number): Promise<Response> {
  const apiUrl = `${baseApi}/${url}/${roomId}`;
  try {
    const response = await jwtAxiosInstance.get(apiUrl);
    console.log('enterRoomApi is successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error to enterRoomApi:', error);
    throw new Error('Failed to enterRoomApi');
  }
}

/*** 게임 대기실 퇴장 ***/
async function leaveRoomApi(roomId: number): Promise<number> {
  const apiUrl = `${baseApi}/${url}/${roomId}`;
  try {
    const response = await jwtAxiosInstance.delete(apiUrl);
    console.log('leaveRoomApi is successfully:', response.data);
    return response.data.status;
  } catch (error) {
    console.error('Error to leaveRoomApi:', error);
    throw new Error('Failed to leaveRoomApi');
  }
}

/*** 게임 대기실 정보 변경 ***/
async function modifyRoomApi(
  roomId: number,
  modifyingRoom: ModifyingRoomType,
): Promise<number> {
  const apiUrl = `${baseApi}/${url}/${roomId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl, modifyingRoom);
    console.log('modifyRoomApi is successfully:', response.data);
    return response.data.status;
  } catch (error) {
    console.error('Error to modifyRoomApi:', error);
    throw new Error('Failed to modifyRoomApi');
  }
}

/*** 초대 링크 생성 ***/
async function inviteRoomWithLinkApi(roomId: number): Promise<Response> {
  const apiUrl = `${baseApi}/${url}/${roomId}/invite`;
  try {
    const response = await jwtAxiosInstance.get(apiUrl);
    console.log('inviteRoomWithLinkApi is successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error to inviteRoomWithLinkApi:', error);
    throw new Error('Failed to inviteRoomWithLinkApi');
  }
}

export { enterRoomApi, leaveRoomApi, modifyRoomApi, inviteRoomWithLinkApi };
