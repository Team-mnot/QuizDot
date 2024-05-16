//src/pages/survival/components/QuizResultComponent.tsx

import { useEffect, useState } from 'react';
import { useQuizStore } from '../store';
import { useQuiz2 } from '../hooks/useQuiz2';
import { RoomInfoType } from '@/shared/apis/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { getQuizResult } from '../api/api';
// interface QuizResultComponentProps {
//   roomInfo: RoomInfoType;
// }

export function QuizResultComponent({ roomInfo }: { roomInfo: RoomInfoType }) {
  const {
    resultMessage,
    setShowResult,
    setShowCountDown,
    isGameOver,
    quizzes,
    currentQuizIndex,
  } = useQuizStore();
  const { handleNextQuiz } = useQuiz2(
    roomInfo.roomId,
    roomInfo.category,
    roomInfo.gameMode,
  );

  const userStore = useUserStore();
  const [answerIndex, setAnswerIndex] = useState<number>();
  useEffect(() => {
    if (roomInfo.hostId === userStore.id) {
      getQuizResult(roomInfo.roomId); // 방장만 호출하는거
    }
    setAnswerIndex(currentQuizIndex);
    // handleNextQuiz(); // 각 개인이 갖고있는 퀴즈목록에서 다음으로 가자는거임
    const timer = setTimeout(() => {
      setShowResult(false);
      setShowCountDown(true); // 카운트다운 페이지 가져와
    }, 5000);

    if (isGameOver) {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (answerIndex !== undefined) {
      handleNextQuiz(); // 각 개인이 갖고있는 퀴즈목록에서 다음으로 가자는거임
    }
  }, [answerIndex, handleNextQuiz]);

  return (
    <div className="text-4lx fixed left-0 right-0 top-10 mx-auto flex h-44 max-w-3xl items-center justify-center rounded-xl bg-white p-4">
      <div className="flex justify-center text-4xl">{resultMessage}</div>
      <div>
        {answerIndex !== undefined && (
          <div>Answers: {quizzes[answerIndex].answers.join(', ')}</div>
        )}{' '}
      </div>
    </div>
  );
}
