// src/pages/survival/hooks/useQuiz2.tsx

import { useEffect, useState } from 'react';
import useQuizStore from '../store';

export function useQuiz2() {
  const [loading, setLoading] = useState(true); // customHook 국밥
  const [error, setError] = useState<Error | string | null>(null); // 국밥. 사실 여기서 Error 타입은 안쓰고잇죠~ 에러메세지 렌더링 안할거라 ~
  // useQuizIndex에서 사용하십쇼
  const {
    quizzes,
    currentQuiz,
    currentQuizIndex,
    setCurrentQuizIndex,
    setCurrentQuiz,
  } = useQuizStore();

  // TODO : 이거 문제 비었을 때 경우 고려 수정해야함
  useEffect(() => {
    if (quizzes.length > 0) {
      setLoading(false);
      setError(null);
    } else {
      setLoading(false);
      setError('퀴즈 목록 읍써요');
    }
  }, [quizzes]); // store의 quizzes 바뀌면 다시 인덱스 0으로 바꾸고 재시작해야죠 ?

  useEffect(() => {
    // 이 useEffect는 currentQuizIndex가 바뀔 때마다 자동으로 currentQuiz를 업데이트합니다.
    setCurrentQuiz(quizzes[currentQuizIndex] || null);
  }, [currentQuizIndex, quizzes, setCurrentQuiz]);

  // 다음 퀴즈로 ~!
  const handleNextQuiz = () => {
    if (quizzes.length > 0) {
      // 다음 인덱스 계산
      const nextIndex = (currentQuizIndex + 1) % quizzes.length;
      setCurrentQuizIndex(nextIndex); // 인덱스 업데이트
    }
  };

  // 퀴즈 제출 로직
  const handleQuizSubmission = (answer: string[]) => {
    console.log('내가 제출한 답 :', answer);
  };

  return {
    quizzes,
    currentQuiz,
    currentQuizIndex,
    loading,
    error,
    handleQuizSubmission,
    handleNextQuiz,
  };
}
