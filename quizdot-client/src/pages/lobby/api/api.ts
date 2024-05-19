import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { CreatingRoomType, LobbyInfoType } from './types';
import { Response } from '@/shared/apis/types';

const url = 'lobby';

/*** 게임 대기실 생성 ***/
async function createRoomApi(
  channelId: number,
  creatingRoomInfo: CreatingRoomType,
): Promise<Response> {
  const apiUrl = `${baseApi}/${url}/channel/${channelId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl, creatingRoomInfo);
    // console.log('createRoomApi is successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error to createRoomApi:', error);
    throw new Error('Failed to createRoomApi');
  }
}

/*** 채널 로비 입장 ***/
async function enterLobbyApi(channelId: number): Promise<LobbyInfoType> {
  const apiUrl = `${baseApi}/${url}/channel/${channelId}`;
  try {
    const response = await jwtAxiosInstance.get(apiUrl);
    console.log('enterLobbyApi is successfully:', response.data);
    return {
      channelId: response.data.data.channelId,
      activeUsers: response.data.data.activeUserDtos,
      roomInfos: response.data.data.roomInfoDtos,
    };
  } catch (error) {
    console.error('Error to enterLobbyApi:', error);
    throw new Error('Failed to enterLobbyApi');
  }
}

/*** 비공개 방 비밀번호 확인 ***/
async function checkRoomPwdApi(
  roomId: number,
  password: string,
): Promise<number> {
  const apiUrl = `${baseApi}/${url}/${roomId}/pwd-check`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl, password);
    console.log('checkRoomPwdApi is successfully:', response.data);
    return response.data.status;
  } catch (error) {
    console.error('Error to checkRoomPwdApi:', error);
    throw new Error('Failed to checkRoomPwdApi');
  }
}

/*** 채널 로비 퇴장 ***/
async function leaveLobbyApi(channelId: number): Promise<number> {
  const apiUrl = `${baseApi}/${url}/channel/exit?channelId=${channelId}`;
  try {
    const response = await jwtAxiosInstance.get(apiUrl);
    console.log('leaveLobbyApi is successfully:', response.data);
    return response.data.status;
  } catch (error) {
    console.error('Error to leaveLobbyApi:', error);
    throw new Error('Failed to leaveLobbyApi');
  }
}

export { createRoomApi, enterLobbyApi, checkRoomPwdApi, leaveLobbyApi };
