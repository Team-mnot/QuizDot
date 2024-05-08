// src/pages/survival/hooks/useQuiz2.tsx

import { useEffect, useState } from 'react';
import useQuizStore from '../store';

// 상위에서 웹소켓 이미 연결됐다고 가정할겁니다? 불만있으신가요? 에?
// import { useWebSocket } from './websocketProvider'; // WebSocketProvider에서 제공하는 컨텍스트 훅 사용

// useQuiz라는 customHook에서 이 3개 사용할거니께~
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
  const handleQuizSubmission = (answers: string[]) => {
    console.log('Submitted answers:', answers);
  };

  // 언마운트 될 때 타이머 없애야합니다~ 아니면 언마운트 돼도 타이머 계속돌아간대요
  // 그니까 좋은 말로 할 때 useEffect로 감시하다가 변하면 로직수행하고 return하면서 언마운트 하라고

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
