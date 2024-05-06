//src/pages/survival/components/QuizComponent.tsx

import { useQuiz2 } from '../hooks/useQuiz2';
import { useState } from 'react';
import useSubmitAnswer from '../hooks/useSubmitAnswer';
import useQuizStore from '../store';

export function QuizComponent({
  roomId,
  category,
  count,
}: {
  roomId: number;
  category: string;
  count: number;
}) {
  const { setShowChatBox, resultMessage, setResultMessage, setShowResult } =
    useQuizStore();
  const [userAnswer, setUserAnswer] = useState(''); // 사용자 입력을 저장할 상태

  const { currentQuiz, loading, error } = useQuiz2(roomId, category, count);
  const {
    submitAnswer,
    loading: submitLoading,
    // error: submitError,
  } = useSubmitAnswer();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  if (!currentQuiz) return <div>No Quiz Available</div>;

  const handleAnswerSubmit = async () => {
    // async 쓰지말까.. 어차피 정답 오답 내는건 데이터 보내는거 기다릴 필요 없긴한데
    // 그래도 서버에 제출했다는 신호 주는거 확인은 해보자고 ~
    await submitAnswer(roomId, currentQuiz.id);
    setShowChatBox(true); // 정답제출시 채팅박스 표시
    if (currentQuiz?.answers.includes(userAnswer.trim())) {
      setResultMessage('정답');
    } else {
      setResultMessage('오답');
    }
    setUserAnswer('');
  };

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
      <div className={'mx-auto'}>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="정답을~ 적어줘요~"
        />
        <button onClick={handleAnswerSubmit} disabled={submitLoading}>
          {'정답 제출'}
        </button>
        {resultMessage && <p>진인사 대천명.. 결과를 기다리거라.. </p>}
      </div>
    </div>
  );
}
