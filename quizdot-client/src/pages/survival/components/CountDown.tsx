// src/pages/survival/components/CountDown.tsx

import { useEffect, useState } from 'react';
import { useQuizStore } from '../store';

export function CountDown() {
  const [count, setCount] = useState(3); // 카운트다운 시간 설정
  const { setShowCountDown } = useQuizStore();

  useEffect(() => {
    // 타이머 설정
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount > 1) {
          return prevCount - 1;
        } else {
          clearInterval(timer);
          setShowCountDown(false); // 카운트다운 상태를 false로 설정
          return prevCount;
        }
      });
    }, 1000);

    // 클린업 함수
    return () => clearInterval(timer);
  }, [setShowCountDown]);

  return (
    <div className="fixed left-0 right-0 top-10 mx-auto max-w-3xl">
      <div className="flex justify-center">
        <h1>{count}초 뒤 퀴즈 </h1>
      </div>
    </div>
  );
}
