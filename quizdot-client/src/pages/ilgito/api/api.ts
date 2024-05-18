import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { Response } from '@/shared/apis/types';

const url = 'oto';

/*** 스테이지 별, 정답을 맞힌 플레이어의 점수 업데이트 ***/
async function selectQuizApi(
  roomId: number,
  questionId: number,
): Promise<boolean> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/select/${roomId}/${questionId}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.status;
  else throw response.data.error;
}

// CHECK 정답 여부 1, 0 으로 보내는 거 맞는지
async function submitAnswerApi(
  roomId: number,
  isCorrect: boolean,
): Promise<boolean> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/score/${roomId}/`,
    {
      result: `${isCorrect ? 1 : 0}`,
    },
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.status;
  else throw response.data.error;
}

/*** 리워드 지급 및 결과 정보 제공 ***/
async function exitGameApi(roomId: number): Promise<Response> {
  const response = await jwtAxiosInstance.post(
    `${baseApi}/${url}/exit/${roomId}`,
  );

  console.log(`[${response.data.status}] ${response.data.message}`);
  if (response.data.status == 200) return response.data.data;
  else throw response.data.error;
}

export { selectQuizApi, submitAnswerApi, exitGameApi };
