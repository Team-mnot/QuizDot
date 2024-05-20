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
      <div className="flex h-[220px] w-[640px] flex-col justify-between rounded-md border-r-2 bg-white p-4 py-5 shadow-md">
        <div className="h-16 text-center">
          <p>Q.&nbsp;{index}&nbsp;</p>
          <p>{question}</p>
        </div>
        <div className={'text-end'}>
          <p className={'text-gray-400'}>
            카테고리&nbsp;:&nbsp;{categoryList[category]}
          </p>
        </div>
      </div>
      {questionType === 'IMAGE' && (
        <div className="flex w-[640px] justify-center rounded-md border-r-2 bg-white p-5 shadow-md">
          <img
            src={imagePath}
            alt=""
            className="max-h-[300px] min-h-[200px] min-w-[200px] max-w-[500]"
          />
        </div>
      )}
    </div>
  );
}
