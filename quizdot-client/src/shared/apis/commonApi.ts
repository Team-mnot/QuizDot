import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
// import axiosInstance from '../utils/axiosInstance';
import { baseApi } from '@/shared/apis';
// import { Response } from '@/shared/apis/types';

const url = 'game';

/*** 게임 시작 ***/
async function startGameApi(roomId: number, mode: string): Promise<number> {
  const params = new URLSearchParams();
  params.append('mode', mode);
  const response = await jwtAxiosInstance.get(
    `${baseApi}/${url}/start/${roomId}`,
    { params: params },
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.status;
  else throw response.data.error;
}

/*** 조건에 따른 퀴즈 목록 조회 ***/

/*** 문제 패스 ***/

export { startGameApi };
