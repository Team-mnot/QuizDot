// src/pages/survival/components/QuizDummyComponent.tsx

const dummyData = {
  question: 'Q.4 매니악이 피쳐링한 솔비의 노래 이름은?',
};

export function QuizDummyComponent() {
  return (
    <div
      className={
        'fixed left-0 right-0 top-10 mx-auto max-w-3xl rounded-xl bg-white p-4'
      }
    >
      {dummyData.question}
    </div>
  );
}
