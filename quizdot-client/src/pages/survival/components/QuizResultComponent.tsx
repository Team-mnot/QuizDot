//src/pages/survival/components/QuizResultComponent.tsx

import { useEffect } from 'react';
import useQuizStore from '../store';

export function QuizResultComponent() {
  const { resultMessage, setShowResult, setShowCountDown } = useQuizStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      // setTimeOut에는 실행할 함수, 지연시간 2개 넣습니다잉 5초뒤에 ShowResult를 false로 만들겠단 소리죠~
      setShowResult(false);
      setShowCountDown(true); // 카운트다운 시작
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <p>{resultMessage} 이었씁니다~~~~~~!</p>
    </div>
  );
}
