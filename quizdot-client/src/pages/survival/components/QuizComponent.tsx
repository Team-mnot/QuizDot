//src/pages/survival/components/QuizComponent.tsx

import { useQuiz2 } from '../hooks/useQuiz2';
import { useState, useEffect } from 'react';
import useIsSubmitAnswer from '../hooks/useIsSubmitAnswer';
import useQuizStore from '../store';

export function QuizComponent({ roomId }: { roomId: number }) {
  const {
    setShowChatBox,
    // resultMessage,
    setResultMessage,
    quizzes,
    setShowResult,
    setCurrentQuiz,
    currentQuizIndex,
  } = useQuizStore();

  const { loading, error } = useQuiz2(); // 수정: useQuiz2에서 필요한 데이터를 가져오도록 함
  const [userAnswer, setUserAnswer] = useState(''); // 사용자 입력을 저장할 상태
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // 사용자 입력을 저장할 상태
  const { currentQuiz } = useQuizStore();

  const {
    submitAnswer,
    loading: submitLoading,
    // error: submitError,
  } = useIsSubmitAnswer();

  useEffect(() => {
    const currentQuiz = quizzes[currentQuizIndex] || null;
    setResultMessage('제출 안하니? 🐦');
    setCurrentQuiz(currentQuiz);
    setShowChatBox(false);
  }, [currentQuizIndex, quizzes, setCurrentQuiz]);

  // async 쓰지말까.. 어차피 정답 오답 내는건 데이터 보내는거 기다릴 필요 없긴한데
  // 그래도 서버에 제출했다는 신호 주는거 확인은 해보자고 ~
  const handleAnswerSubmit = async () => {
    setIsAnswerSubmitted(true);
    if (currentQuiz) {
      if (
        userAnswer.trim() === '' ||
        !currentQuiz.answers.includes(userAnswer.trim())
      ) {
        setResultMessage('오답 😿');
      } else {
        setResultMessage('정답! 🐣');
      }

      setShowChatBox(true);
      setUserAnswer('');
      await submitAnswer(roomId, currentQuiz.id);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAnswerSubmit();
    }
  };

  // 여기서 n초뒤에 결과창으로 넘어갈 때( 가기전 ) 모든 로직 수행해야함
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatBox(true);
      setShowResult(true);
    }, 8000); // n초 후 결과창으로 전환

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!quizzes.length || !currentQuiz) return null; // currentQuiz가 store에 있으니까 null일 때 애매해짐

  return (
    <div>
      <div
        className={
          'fixed left-0 right-0 top-10 mx-auto max-w-3xl rounded-xl bg-white p-4'
        }
      >
        <div key={currentQuiz.id}>
          <h2>{currentQuiz.question}</h2>
          <p>{currentQuiz.description}</p>
          <p>Hint: {currentQuiz.hint}</p>
          <p>Category: {currentQuiz.category}</p>
          <p>Type: {currentQuiz.questionType}</p>
          <p>Answers: {currentQuiz.answers.join(', ')}</p>
        </div>
      </div>

      {/* 정답 제출 합시다 ~ */}
      <div
        className={
          'fixed bottom-72 left-0 right-0 mx-auto  max-w-3xl rounded-xl bg-white p-4'
        }
      >
        {isAnswerSubmitted ? (
          <div className="flex justify-center">다른사람 기다려</div>
        ) : (
          <div className="flex justify-between">
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="정답을~ 적어줘요~"
            />
            <button onClick={handleAnswerSubmit} disabled={submitLoading}>
              {'정답 제출'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
