export function QuizResult({ isResult }: { isResult: boolean }) {
  return (
    <div className="flex h-[150px] w-[640px] flex-col justify-between rounded-md border-r-2 bg-white p-4 py-5 shadow-md">
      <div className="flex h-16 items-center justify-center text-center text-3xl">
        {isResult ? <p>정답!</p> : <p>오답!</p>}
      </div>
    </div>
  );
}
