import { categoryList } from '@/pages/lobby/constants';

export function Quiz({
  index,
  questionType,
  question,
  category,
  imagePath,
}: {
  index: number;
  questionType: string;
  question: string;
  category: string;
  imagePath: string;
}) {
  return (
    <div>
      <div className="flex h-[150px] w-[500px] flex-col justify-between rounded-md border-r-2 bg-white p-4 py-5 shadow-md">
        <div className="h-16 text-center">
          <p>Q.&nbsp;{index}&nbsp;</p>
          <p>{question}</p>
        </div>
        <div className={'text-end'}>
          <p className={'text-gray-400'}>
            문제 유형&nbsp;:&nbsp;{categoryList[category]},
            &nbsp;정답률&nbsp;:&nbsp;-
          </p>
        </div>
      </div>
      {questionType === 'IMAGE' && (
        <div className="w-[500px] rounded-md border-r-2 bg-white p-5 shadow-md">
          <img src={imagePath} alt="" className="h-[300px] w-[400px]" />
        </div>
      )}
    </div>
  );
}
