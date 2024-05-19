import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { baseApi } from '@/shared/apis';
import { Response } from '@/shared/apis/types';

const url = 'oto';

/*** 일대일 문제 전달 API ***/
async function selectQuestionApi(
  roomId: number,
  questionId: number,
): Promise<void> {
  const apiUrl = `${baseApi}/${url}/select/${roomId}/${questionId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl);
    console.log('selectQuestionApi is successfully:', response.data);
  } catch (error) {
    console.error('Error to selectQuestionApi:', error);
    throw new Error('Failed to selectQuestionApi');
  }
}

/*** 일대일 점수 업데이트 API ***/
async function updateScoresApi(roomId: number, result: number): Promise<void> {
  const apiUrl = `${baseApi}/${url}/score/${roomId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl, { result });
    console.log('updateScoresApi is successfully:', response.data);
  } catch (error) {
    console.error('Error to updateScoresApi:', error);
    throw new Error('Failed to updateScoresApi');
  }
}

/*** 일대일 결과 업데이트 API ***/
async function exitGameApi(roomId: number): Promise<Response> {
  const apiUrl = `${baseApi}/${url}/exit/${roomId}`;
  try {
    const response = await jwtAxiosInstance.post(apiUrl);
    console.log('exitGameApi is successfully:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error to exitGameApi:', error);
    throw new Error('Failed to exitGameApi');
  }
}

export { selectQuestionApi, updateScoresApi, exitGameApi };
