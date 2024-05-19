import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { Response } from '@/shared/apis/types';

const url = 'multi';

/*** 스테이지 별, 정답을 맞힌 플레이어의 점수 업데이트 ***/
async function updateScoresApi(
  roomId: number,
  questionId: number,
): Promise<number> {
  const apiUrl = `${baseApi}/${url}/score/${roomId}/${questionId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl);
    console.log('updateScoresApi is successfully:', response.data);
    return response.data.status;
  } catch (error) {
    console.error('Error to updateScoresApi:', error);
    throw new Error('Failed to updateScoresApi');
  }
}

/*** 멀티 모드 리워드 지급 및 결과 정보 제공 ***/
async function exitGameApi(roomId: number): Promise<Response> {
  const apiUrl = `${baseApi}/${url}/exit/${roomId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl);
    console.log('exitGameApi is successfully:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error to exitGameApi:', error);
    throw new Error('Failed to exitGameApi');
  }
}

export { updateScoresApi, exitGameApi };
