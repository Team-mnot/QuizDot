// src/pages/survival/components/CountDown.tsx

import { useEffect, useState } from 'react';
import useQuizStore from '../store';
import { useQuiz2 } from '../hooks/useQuiz2';

export function CountDown() {
  const [count, setCount] = useState(3); // 카운트다운 시간 설정, 예: 3초
  const { setShowCountDown } = useQuizStore();
  const { handleNextQuiz } = useQuiz2();

  useEffect(() => {
    const timer = setInterval(() => {
      if (count > 0) {
        setCount(count - 1);
      } else {
        clearInterval(timer);
        setShowCountDown(false); // 카운트다운 상태를 false로 설정
        handleNextQuiz(); // 다음 퀴즈로 넘어가는 함수 호출
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [count, setShowCountDown, handleNextQuiz]);

  return (
    <div className="countdown-container">
      <h1>{count}초 뒤 퀴즈 !! 부와아아아아아아아아앙 !! </h1>
    </div>
  );
}
