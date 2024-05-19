//src/pages/survival/components/QuizResultComponent.tsx

import { useEffect, useState } from 'react';
import { useQuizStore } from '../store';
import { useQuiz2 } from '../hooks/useQuiz2';
import { RoomInfoType } from '@/shared/apis/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { getQuizResult } from '../api/api';
import useRequestQuestion from '../hooks/useRequestQuestion';
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
  const { handleNextQuiz } = useQuiz2();

  const userStore = useUserStore();
  const [answerIndex, setAnswerIndex] = useState<number>();
  const [currentDescription, setCurrentDescription] = useState<string>();
  const [currentAnswer, setCurrentAnswer] = useState<string[]>([]);
  useEffect(() => {
    if (roomInfo.hostId === userStore.id) {
      getQuizResult(roomInfo.roomId); // 방장만 호출하는거
    }
    setAnswerIndex(currentQuizIndex);
    const timer = setTimeout(() => {
      setShowResult(false);
      setShowCountDown(true); // 카운트다운 페이지 가져와
    }, 5000);

    if (isGameOver) {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, []);

  const { requestQuestion } = useRequestQuestion();

  useEffect(() => {
    if (answerIndex !== undefined) {
      setCurrentAnswer(quizzes[answerIndex].answers);
      setCurrentDescription(quizzes[answerIndex].description);
      handleNextQuiz(); // 각 개인이 갖고있는 퀴즈목록에서 다음으로 가자는거임
      if (
        roomInfo.hostId == userStore.id &&
        answerIndex == quizzes.length - 1
      ) {
        requestQuestion(
          roomInfo.roomId,
          roomInfo.category,
          3,
          roomInfo.gameMode,
        ); // 새로운 문제 요청
      }
    }
  }, [answerIndex]);

  return (
    <div className="text-4lx fixed left-0 right-0 top-10 mx-auto flex h-44 max-w-3xl flex-col items-center justify-center rounded-xl bg-white p-4">
      <div className="flex justify-center text-4xl">{resultMessage}</div>
      <div>
        {currentAnswer.length > 0 && (
          <div>Answers: {currentAnswer.join(', ')}</div>
        )}{' '}
        {currentDescription && <div>설명 : {currentDescription}</div>}
      </div>
    </div>
  );
}
