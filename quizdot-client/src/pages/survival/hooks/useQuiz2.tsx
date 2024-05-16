// src/pages/survival/hooks/useQuiz2.tsx

import { useEffect, useState } from 'react';
import useQuizStore from '../store';
import useRequestQuestion from './useRequestQuestion';

export function useQuiz2(roomId: number, category: string, gameMode: string) {
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
    if (quizzes && quizzes.length > 0) {
      setLoading(false);
      setError(null);
    } else {
      setLoading(false);
      setError('문제를 받아오고 있습니다 ... ');
    }
  }, [quizzes]); // store의 quizzes 바뀌면 다시 인덱스 0으로 바꾸고 재시작해야죠 ?

  useEffect(() => {
    // 이 useEffect는 currentQuizIndex가 바뀔 때마다 자동으로 currentQuiz를 업데이트합니다.
    setCurrentQuiz(quizzes[currentQuizIndex] || null);
  }, [currentQuizIndex, quizzes, setCurrentQuiz]);

  const { requestQuestion } = useRequestQuestion();

  // 다음 퀴즈로 ~!
  // TODO : handleNextQuiz 분리해서 변수 세개받는걸로 만들어야함
  const handleNextQuiz = () => {
    if (quizzes.length > 0) {
      const nextIndex = currentQuizIndex + 1;
      if (nextIndex >= quizzes.length) {
        // 모든 문제를 다 출제한 경우
        // TODO : 이거 호스트만 할 필요가 없긴 한데 나중에 추가할지 오류나는지 보자
        requestQuestion(roomId, category, 3, gameMode); // 새로운 문제 요청
        setCurrentQuizIndex(0); // 다시 첫 번째 문제로 인덱스 설정
      } else {
        setCurrentQuizIndex(nextIndex);
      }
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
