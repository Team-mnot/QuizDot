// src/pages/survival/hooks/useQuiz2.tsx

import { useEffect, useRef, useState } from 'react';
import { iQuiz } from '../api/types';
import { fetchQuizData } from '../api/api';
import useQuizStore from '../store';

// 상위에서 웹소켓 이미 연결됐다고 가정할겁니다? 불만있으신가요? 에?
// import { useWebSocket } from './websocketProvider'; // WebSocketProvider에서 제공하는 컨텍스트 훅 사용

// useQuiz라는 customHook에서 이 3개 사용할거니께~
export function useQuiz2(roomId: number, category: string, count: number) {
  const [quizzes, setQuizzes] = useState<iQuiz[]>([]); // iQuiz 타입을 배열로 가지는 배열 ~~!
  const [loading, setLoading] = useState(true); // customHook 국밥
  const [error, setError] = useState<Error | string | null>(null); // 국밥. 사실 여기서 Error 타입은 안쓰고잇죠~ 에러메세지 렌더링 안할거라 ~
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0); // Quiz 넘어갈 때 처리하려고
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const { setResultMessage, setShowChatBox, setIsQuizOver } = useQuizStore();

  // const { nextQuizSignal, setNextQuizSignal } = useWebSocket();

  // 일단 문제 받아오는 부분 ~!~!~!
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

  // 아마 여기 시작~~~~~~~~~ 합니다~~~~~~~~~~~ component 띄워야 할듯 ㅎ;

  useEffect(() => {
    const handleNextQuiz = () => {
      setResultMessage(''); // 문제 전환 직전에 결과 메시지 초기화
      setShowChatBox(false);

      setCurrentQuizIndex((index) => (index + 1) % quizzes.length);
    };

    if (quizzes.length > 0) {
      // 퀴즈 1개 이상이면! 타이머 세팅 가즈아 ~~~~
      timeRef.current = setTimeout(handleNextQuiz, 20000); // setTimeout : 매개변수 2개 받음, 1. 실행할 함수(handleNextQuiz) 2. 지연시간 (20000ms)
    }

    // 언마운트 될 때 타이머 없애야합니다~ 아니면 언마운트 돼도 타이머 계속돌아간대요
    // 그니까 좋은 말로 할 때 useEffect로 감시하다가 변하면 로직수행하고 return하면서 언마운트 하라고
    return () => {
      if (timeRef.current) {
        clearTimeout(timeRef.current);
      }
    };
  }, [currentQuizIndex, quizzes.length]);

  // 외부 신호에 의한 즉시 퀴즈 전환
  // useEffect(() => {
  //   if (nextQuizSignal) {
  //     const newIndex = (currentQuizIndex + 1) % quizzes.length;
  //     setCurrentQuizIndex(newIndex);
  //     // setCurrentQuizIndex((index) => (index + 1) % quizzes.length); // newIndex 정의해서 쓰세요 ~
  //     setNextQuizSignal(false); // 신호 상태 리셋
  //   }
  //   // 여기서도 타이머 리셋하셔야죠 ~
  //   if (timeRef.current) {
  //     clearTimeout(timeRef.current);
  //   }
  // }, [nextQuizSignal]);

  const handleQuizSubmission = (answers: string[]) => {
    // 여기서 제출하는 폼? 아무튼 뭐시기 만들어야함
    console.log('Submitted answers:', answers);
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    // 여기서 백엔드에 제출했어요! 라고 손들고 말하셔야 합니다 꼭 꼭 꼭
    ////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////
    setCurrentQuizIndex((currentQuizIndex + 1) % quizzes.length);
  };

  const currentQuiz = quizzes[currentQuizIndex];

  return {
    quizzes,
    currentQuiz,
    currentQuizIndex,
    loading,
    error,
    handleQuizSubmission,
  };
}
