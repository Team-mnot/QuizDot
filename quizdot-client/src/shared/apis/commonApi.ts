import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { Response } from '@/shared/apis/types';

const url = 'game';

/*** 게임 시작 ***/
async function startGameApi(roomId: number, mode: string): Promise<number> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/start/${roomId}?mode=${mode}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.status;
  else throw response.data.error;
}

/*** 조건에 따른 퀴즈 목록 조회 ***/
async function getQuizzes(
  roomId: number,
  category: string,
  count: number,
  modeType: string,
): Promise<Response> {
  const response = await jwtAxiosInstance.get(
    `${baseApi}/${url}/quiz/${roomId}?category=${category}&count=${count}&modeType=${modeType}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data;
  else throw response.data.error;
}

/*** 문제 패스 ***/
async function passQuestion(
  roomId: number,
  questionId: number,
): Promise<number> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/quiz/${roomId}/${questionId}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.status;
  else throw response.data.error;
}

export { startGameApi, passQuestion, getQuizzes };
