//src/pages/survival/components/QuizComponent.tsx

import { useFetchQuiz } from '../hooks/useFetchQuiz';

export function QuizComponent({
  roomId,
  category,
  count,
}: {
  roomId: number;
  category: string;
  count: number;
}) {
  const { quizData, loading, error } = useFetchQuiz(roomId, category, count);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;
  return (
    <div
      className={
        'fixed left-0 right-0 top-10 mx-auto max-w-3xl rounded-xl bg-white p-4'
      }
    >
      {quizData.map((quiz) => (
        <div key={quiz.id}>
          <h2>{quiz.question}</h2>
          <p>{quiz.description}</p>
          <p>Hint: {quiz.hint}</p>
          <p>Category: {quiz.category}</p>
          <p>Type: {quiz.questionType}</p>
          <p>Answers: {quiz.answers.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}
