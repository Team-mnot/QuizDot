export function Quiz({
  questionType,
  question,
  category,
  imagePath,
}: {
  questionType: string;
  question: string;
  category: string;
  imagePath: string;
}) {
  return (
    <div>
      <div className="h-28 w-[500px] rounded-md border-r-2 bg-white p-4 py-5 shadow-md">
        <div className="h-16 text-center">
          <p>Q. </p>
          <p>{question}</p>
        </div>
        <div className={'h-12 text-end'}>
          <p className={'text-gray-400'}>문제 유형: {category}, 정답률: -</p>
        </div>
      </div>
      <div className="rounded-md border-r-2 bg-white p-5 shadow-md">
        {questionType === 'IMAGE' && (
          <img src={imagePath} alt="" className="h-[300px] w-[500px]" />
        )}
      </div>
    </div>
  );
}
