//src/pages/survival/components/QuizComponent.tsx

import { useQuiz2 } from '../hooks/useQuiz2';
import { useState, useEffect, useRef } from 'react';
import requestQuestion from '../hooks/useRequestQuestion';
import { useQuizStore } from '../store';
import { postQuizResult } from '../api/api';
import { RoomInfoType } from '@/shared/apis/types';
import { Progress } from '@/shared/ui';

export function QuizComponent({ roomInfo }: { roomInfo: RoomInfoType }) {
  const {
    setShowChatBox,
    // resultMessage,
    setResultMessage,
    quizzes,
    setShowResult,
    setCurrentQuiz,
    currentQuizIndex,
    currentQuiz,
    // isCorrect,
    setIsCorrect,
    showHint,
    setShowHint,
  } = useQuizStore();

  // TODO : useQuiz에 handleNextQuiz 넣을 필요 없는데 나중에 분리합시다
  const { loading, error } = useQuiz2(
    roomInfo.roomId,
    roomInfo.category,
    roomInfo.gameMode,
  );
  const [userAnswer, setUserAnswer] = useState(''); // 사용자 입력을 저장할 상태
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // 사용자 입력을 저장할 상태
  const [countdown, setCountdown] = useState(10); // 카운트다운 초기값 설정

  const {
    loading: submitLoading,
    // error: submitError,
  } = requestQuestion();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const currentQuiz = quizzes[currentQuizIndex] || null;
    setIsCorrect(false);
    setResultMessage('제출 안함');
    setCurrentQuiz(currentQuiz);
    setShowChatBox(false);
  }, [currentQuizIndex, quizzes]);

  const handleAnswerSubmit = async () => {
    if (userAnswer.trim() === '') {
      setResultMessage('정답을 입력하세요.');
      return;
    }

    setIsAnswerSubmitted(true);
    let answerIsCorrect = false;

    if (currentQuiz) {
      const sanitizedUserAnswer = userAnswer.replace(/\s/g, '');
      const sanitizedCorrectAnswers = currentQuiz.answers.map((answer) =>
        answer.replace(/\s/g, ''),
      );

      if (!sanitizedCorrectAnswers.includes(sanitizedUserAnswer)) {
        setResultMessage('오답 😿');
      } else {
        setResultMessage('정답! 🐣');
        answerIsCorrect = true;
      }

      setShowChatBox(true);
      setUserAnswer('');
      setIsCorrect(answerIsCorrect);

      await postQuizResult(roomInfo.roomId, answerIsCorrect); // API 호출
    }
  };

  // 엔타 눌라도 제출될라요
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnswerSubmit();
    }
  };

  // 입력 창에 포커스 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 힌트 몇초뒤에 띄울까?
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 여기서 n초뒤에 결과창으로 넘어갈 때( 가기전 ) 모든 로직 수행해야함
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const resultTimer = setTimeout(() => {
      setShowChatBox(true);
      setShowResult(true);
      setShowHint(false);
      clearInterval(countdownTimer);
    }, 10000);

    return () => {
      clearInterval(countdownTimer); // 컴포넌트 언마운트 시 타이머 해제
      clearTimeout(resultTimer);
    };
  }, []);

  const getColor = () => {
    if (countdown <= 3) return 'red';
    if (countdown <= 5) return 'yellow';
    return 'lightgreen';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!quizzes.length || !currentQuiz) return null; // currentQuiz가 store에 있으니까 null일 때 애매해짐

  return (
    <div>
      <div
        className={
          'fixed left-0 right-0 top-10 mx-auto h-44 max-w-3xl rounded-xl bg-white p-4'
        }
      >
        <div key={currentQuiz.id}>
          <h2>{currentQuiz.question}</h2>
          <p>{currentQuiz.description}</p>
          {/* <p>Type: {currentQuiz.questionType}</p> */}
          {/* <p>Answers: {currentQuiz.answers.join(', ')}</p> */}
        </div>
      </div>
      {/* <div className=" fixed left-0 right-0 top-56 mx-auto max-w-3xl text-yellow-50">
        Category: {currentQuiz.category}
      </div> */}
      {showHint && (
        <div className="fixed left-0 right-0 top-56 mx-auto max-w-3xl text-yellow-50">
          초성힌트: {currentQuiz.hint}
        </div>
      )}
      {currentQuiz.questionType === 'IMAGE' && (
        <div className="flex w-[500px] justify-center rounded-md border-r-2 bg-white p-5 shadow-md">
          <img src={currentQuiz.imagePath} alt="" className="h-[300px]" />
        </div>
      )}

      <Progress
        padding="py-5"
        size="w-[500px]"
        color={getColor()}
        label={`${countdown}`}
        currentValue={countdown}
        maxValue={10}
      ></Progress>

      {/* 정답 제출 합시다 ~ */}
      <div>
        {isAnswerSubmitted ? (
          <div className="fixed bottom-72 left-0 right-0 mx-auto flex justify-center text-4xl text-yellow-50">
            다른사람 기다려
          </div>
        ) : (
          <div
            className={
              'fixed bottom-7 left-0 right-0 z-50 mx-auto max-w-2xl rounded-3xl bg-white'
            }
          >
            <div className="flex justify-between">
              <input
                type="text"
                ref={inputRef}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="정답 입력"
                className="w-5/6 pl-10"
              />
              <button onClick={handleAnswerSubmit} disabled={submitLoading}>
                {'정답 제출'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
