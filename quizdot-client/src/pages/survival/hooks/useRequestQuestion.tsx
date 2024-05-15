//src/pages/survival/hooks/useSubmit.tsx

import { baseApi } from '@/shared/apis';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { useState } from 'react';

// TODO : API 분리. 왜 훅스에 넣어놨서

const useRequestQuestion = () => {
  const [loading, setLoading] = useState(false); // 국밥
  const [error, setError] = useState<string | null>(null); // 국밥

  const requestQuestion = async (
    roomId: number,
    category: string,
    count: number,
    modeType: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jwtAxiosInstance.get(
        `${baseApi}/game/quiz/${roomId}`,
        {
          params: {
            category,
            count,
            modeType, // gameMode로 오지만 params에는 modeType로 전달해야함
          },
        },
      );
      console.log('문제요청 성공');
      if (response.status !== 200) {
        throw new Error('axios 에러~! 문제 달라고 하기 실패 ㅠㅠ');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(' axios 에러는 아닌데.. 뭐지 ');
      }
    } finally {
      setLoading(false); // 국밥
    }
  };
  return { requestQuestion, loading, error };
};
export default useRequestQuestion;
