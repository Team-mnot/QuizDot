import axiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { RoomInfoProps } from './types';

const url = 'lobby';

/*** 대기실 생성 ***/
export async function createRoomApi(
  channelId: number,
  request: RoomInfoProps,
): Promise<void> {
  await axiosInstance
    .post(`${baseApi}/${url}/channel/${channelId}`, request)
    .then((reponse) => {
      console.log('[대기실 생성 성공] : ', reponse);
      return reponse;
    })
    .catch((error) => {
      console.error('[대기실 생성 실패] : ', error);
      return null;
    });
}

/*** 채널 로비 입장 ***/
export async function enterLobbyApi(channelId: number): Promise<void> {
  await axiosInstance
    .post(`${baseApi}/${url}/channel/${channelId}`)
    .then((reponse) => {
      console.log('[채널 로비 입장 성공] : ', reponse);
      return reponse;
    })
    .catch((error) => {
      console.error('[채널 로비 입장 실패] : ', error);
      return null;
    });
}

/*** 비공개 방 비밀번호 확인 ***/
export async function checkPasswordApi(
  roomId: number,
  password: string,
): Promise<void> {
  await axiosInstance
    .post(`${baseApi}/${url}/${roomId}/pwd-check`, password)
    .then((reponse) => {
      console.log('[비밀번호 확인 성공] : ', reponse);
      return reponse;
    })
    .catch((error) => {
      console.error('[비밀번호 확인 실패] : ', error);
      return null;
    });
}
