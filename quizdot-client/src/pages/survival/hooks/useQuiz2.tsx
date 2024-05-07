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
    setResultMessage,
    setShowChatBox,
    setShowResult,
    setShowCountDown,
  } = useQuizStore();

  useEffect(() => {
    if (quizzes.length > 0) {
      setCurrentQuizIndex(0); // 처음에 QuizIndex 0으로 설정함
      setLoading(false);
      setError(null);
    } else {
      setLoading(false);
      setError('퀴즈 목록 읍써요');
    }
  }, [quizzes]); // store의 quizzes 바뀌면 다시 인덱스 0으로 바꾸고 재시작해야죠 ?

  // 다음 퀴즈로 ~!
  const handleNextQuiz = () => {
    if (quizzes.length > 0 && currentQuizIndex < quizzes.length - 1) {
      setShowResult(true); // 카운트다운 페이지 가져와~~!
      const nextIndex = (currentQuizIndex + 1) % quizzes.length;

      setCurrentQuizIndex(nextIndex); // 퀴즈 인덱스 변경해
      const currentQuiz = quizzes[currentQuizIndex] || null; // 여기서 현재퀴즈 바꿔서 QuizComponent로 보내줘야지
      setCurrentQuiz(currentQuiz);
      setResultMessage('');
      setShowChatBox(false);
      setShowResult(false); // Delay for the countdown duration
      setShowCountDown(false);
    }
  };
  // 퀴즈 제출 로직
  const handleQuizSubmission = (answers: string[]) => {
    console.log('Submitted answers:', answers);
    setCurrentQuizIndex((currentQuizIndex + 1) % quizzes.length);
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
