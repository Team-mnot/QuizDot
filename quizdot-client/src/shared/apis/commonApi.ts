import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { Response } from '@/shared/apis/types';

const url = 'game';

/*** 게임 시작 ***/
async function startGameApi(roomId: number, mode: string): Promise<number> {
  const apiUrl = `${baseApi}/${url}/start/${roomId}?mode=${mode}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl);
    console.log('startGameApi is successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error to startGameApi:', error);
    throw new Error('Failed to startGameApi');
  }
}

/*** 조건에 따른 퀴즈 목록 조회 ***/
async function getQuizzesApi(
  roomId: number,
  category: string,
  count: number,
  modeType: string,
): Promise<Response> {
  const apiUrl = `${baseApi}/${url}/quiz/${roomId}?category=${category}&count=${count}&modeType=${modeType}`;
  try {
    const response = await jwtAxiosInstance.get(apiUrl);
    console.log('getQuizzesApi is successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error to getQuizzesApi:', error);
    throw new Error('Failed to getQuizzesApi');
  }
}

/*** 문제 패스 ***/
async function passQuestionApi(
  roomId: number,
  questionId: number,
): Promise<number> {
  const apiUrl = `${baseApi}/${url}/quiz/${roomId}/${questionId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl);
    console.log('passQuestionApi is successfully:', response.data);
    return response.data.status;
  } catch (error) {
    console.error('Error to passQuestionApi:', error);
    throw new Error('Failed to passQuestionApi');
  }
}

export { startGameApi, getQuizzesApi, passQuestionApi };
