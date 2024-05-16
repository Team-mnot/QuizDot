import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { Response } from '@/shared/apis/types';

const url = 'multi';

/*** 스테이지 별, 정답을 맞힌 플레이어의 점수 업데이트 ***/
async function updateScoresApi(
  roomId: number,
  questionId: number,
): Promise<number> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/score/${roomId}/${questionId}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  return response.data.status;
}

/*** 멀티 모드 리워드 지급 및 결과 정보 제공 ***/
async function exitGameApi(roomId: number): Promise<Response> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/exit/${roomId}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.data;
  else throw response.data.error;
}

export { updateScoresApi, exitGameApi };
