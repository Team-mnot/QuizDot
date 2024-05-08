// src/pages/survival/hooks/useFetchQuiz.ts
import { useEffect, useState } from 'react';
import { fetchQuizData } from '../api/api';
import { iQuiz } from '../api/types';

export function useFetchQuiz(roomId: number, category: string, count: number) {
  const [quizData, setQuizData] = useState<iQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null);

  useEffect(() => {
    async function fetchQuiz() {
      setLoading(true);
      try {
        const response = await fetchQuizData(roomId, category, count);
        if (response.status === 200) {
          setQuizData(response.data.quizResList);
          setError(null);
        } else {
          setError('Failed to fetch quiz data.');
          console.log('퀴즈 데이터 페치 실패~~~!');
        }
      } catch (err) {
        // 네트워크 오류 또는 기타 예외 처리
        console.error('퀴즈 데이터 페칭 에러~~!!', err);
        setError('Error fetching quiz data.');
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, []);

  return { quizData, loading, error };
}
