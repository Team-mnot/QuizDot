//src/pages/survival/components/QuizResultComponent.tsx

import { useEffect } from 'react';
import useQuizStore from '../store';
import { useQuiz2 } from '../hooks/useQuiz2';
import { RoomInfoType } from '@/shared/apis/types';

// interface QuizResultComponentProps {
//   roomInfo: RoomInfoType;
// }

export function QuizResultComponent({ roomInfo }: { roomInfo: RoomInfoType }) {
  const { resultMessage, setShowResult, setShowCountDown } = useQuizStore();
  const { handleNextQuiz } = useQuiz2(
    roomInfo.roomId,
    roomInfo.category,
    roomInfo.gameMode,
  );

  useEffect(() => {
    handleNextQuiz();
    const timer = setTimeout(() => {
      setShowResult(false);
      setShowCountDown(true); // 카운트다운 페이지 가져와
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-4lx fixed left-0 right-0 top-10 mx-auto flex h-44 max-w-3xl items-center justify-center rounded-xl bg-white p-4">
      <div className="flex justify-center text-4xl">{resultMessage}</div>
    </div>
  );
}
