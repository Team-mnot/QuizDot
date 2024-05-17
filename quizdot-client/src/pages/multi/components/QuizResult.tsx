export function QuizResult({ isResult }: { isResult: boolean }) {
  return (
    <div className="flex h-[150px] w-[500px] flex-col justify-between rounded-md border-r-2 bg-white p-4 py-5 shadow-md">
      <div className="h-16 text-center">
        {isResult ? <p>정답!</p> : <p>오답!</p>}
      </div>
    </div>
  );
}
