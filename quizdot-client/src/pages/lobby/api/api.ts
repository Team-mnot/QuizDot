import axiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { RoomInfoProps } from './types';

const url = '/api/channel';
const channel = 1;

export async function createTheRoomApi(request: RoomInfoProps): Promise<void> {
  await axiosInstance
    .post(`${baseApi}/${url}/${channel}`, request)
    .then((reponse) => {
      console.log('[방 생성 성공] : ', reponse);
      return reponse;
    })
    .catch((error) => {
      console.error('[방 생성 실패] : ', error);
      return null;
    });
}
