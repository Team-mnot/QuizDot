import { QuizProps } from '../api/types';

interface QuizPropsWithSize extends QuizProps {
  padding: string;
  size: string;
}

export function QuizComponent(props: QuizPropsWithSize) {
  return (
    <div
      className={`rounded-md border-r-2 bg-white p-4 shadow-md ${props.padding} ${props.size}`}
    >
      <div className={'h-16 text-center'}>
        <p>Q. </p>
        <p>{props.question}</p>
      </div>
      <div className={'h-12 text-end'}>
        <p className={'text-gray-400'}>
          문제 유형: {props.category}, 정답률: -
        </p>
      </div>
    </div>
  );
}
