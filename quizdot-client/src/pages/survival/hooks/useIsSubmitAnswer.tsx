//src/pages/survival/hooks/useSubmit.tsx

import { useState } from 'react';

const useIsSubmitAnswer = () => {
  const [loading, setLoading] = useState(false); // 국밥
  const [error, setError] = useState<string | null>(null); // 국밥

  const submitAnswer = async (roomId: number, quizId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/game/quiz/${roomId}/${quizId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '문제 제출 했다고 알리기 실패 ㅠㅠ');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false); // 국밥
    }
  };
  return { submitAnswer, loading, error };
};
export default useIsSubmitAnswer;
