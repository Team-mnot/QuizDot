// src/pages/survival/hooks/useQuiz.tsx

import { useEffect, useRef, useState } from 'react';
import { iQuiz } from '../api/types';
import { fetchQuizData } from '../api/api';

// 상위에서 웹소켓 이미 연결됐다고 가정할겁니다? 불만있으신가요? 에?

export function useQuiz(roomId: number, category: string, count: number) {
  // useQuiz라는 hook에서 이 3개 사용할거니께~
  const [quizzes, setQuizzes] = useState<iQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | string | null>(null); // 사실 여기서 Error 타입은 안쓰고잇죠~ 에러메세지 렌더링 안할거라 ~

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchQuizzes() {
      setLoading(true); // 위잉위잉 로딩 시작 로딩 시작 위이이이이이이이이이잉
      // try, catch에서는 비동기 함수의
      try {
        const response = await fetchQuizData(roomId, category, count);
        if (response.status === 200) {
          setQuizzes(response.data.quizResList); // quizResList 이름 마음에 들어요 ~ 한방에 quizzes에 넣고
          setError(null); // 명시적으로 한번 해 주라는데 뭐 어려운거 아니니까 해놓을게요 ~
        } else {
          setError('퀴즈 데이터 Fetch에 실패했어요 ㅠㅠ '); // 위에서 Error , string, null 형태 받는다고 했으니 string으로 슝 그러면 Error타입은 할필요없나?
        }
      } catch (err) {
        console.log('퀴즈 데이터 fetch 오류 이유는~? : ', err);
        setError('퀴즈 데이터 Fetch오류 발생 ~');
      } finally {
        setLoading(false); // 로딩 끝났으니까 false로 바꿔주세요 ~~!
      }
    }

    fetchQuizzes();
  }, [roomId, category, count]);

  useEffect(() => {
    if (quizzes.length > 0) {
      // 퀴즈 1개 이상이면! 가즈아 ~~~~
      timeRef.current = setTimeout(() => {
        // setTimeout : 매개변수 2개 받음, 1. 실행할 함수(setCurrent...) 2. 지연시간 (20000ms)
        const nextIndex = (currentQuizIndex + 1) % quizzes.length;
        setCurrentQuizIndex(nextIndex);
      }, 2000);
    }

    // 언마운트 될 때 타이머 없애야합니다~ 아니면 언마운트 돼도 타이머 계속돌아간대요
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, [currentQuizIndex, quizzes]);

  const handleQuizSubmission = (answers: string[]) => {
    // Implement the logic to submit the answers to the backend and handle the response
    console.log('Submitted answers:', answers);
    // Assume immediate response for simplicity
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    setCurrentQuizIndex((currentQuizIndex + 1) % quizzes.length);
  };

  const currentQuiz = quizzes[currentQuizIndex];
  return { currentQuiz, loading, error, handleQuizSubmission }; // 여기서 currentQuiz를 포함하여 반환해야 함
}
