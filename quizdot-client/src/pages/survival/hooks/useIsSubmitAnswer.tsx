//src/pages/survival/hooks/useSubmit.tsx

import { baseApi } from '@/shared/apis';
import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { useState } from 'react';

const useIsSubmitAnswer = () => {
  const [loading, setLoading] = useState(false); // 국밥
  const [error, setError] = useState<string | null>(null); // 국밥

  const submitAnswer = async (roomId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await jwtAxiosInstance.get(
        `${baseApi}/survival/score/${roomId}`,
      );
      if (response.status !== 200) {
        throw new Error('axios 에러~! 문제 제출 했다고 알리기 실패 ㅠㅠ');
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
  return { submitAnswer, loading, error };
};
export default useIsSubmitAnswer;
