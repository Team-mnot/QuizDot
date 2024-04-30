import { AnswerProps } from '../api/types';

interface AnswerPropsWithSecNSize extends AnswerProps {
  padding: string;
  size: string;
  sec: number;
}

export function AnswerComponent(props: AnswerPropsWithSecNSize) {
  return (
    <div className={`relative ${props.padding} ${props.size}`}>
      <div className={'absolute top-1/2 w-full text-center '}>
        {props.sec <= 5 && props.sec > 0 ? (
          <div>
            <p>힌트 : {props.hint}</p>
          </div>
        ) : null}

        {props.sec == 0 ? (
          <div>
            <p>정답 : {props.answer}</p>
            <p>{props.description}</p>
          </div>
        ) : null}
      </div>
      <div className={'rounded-md border-r-2 bg-white p-5 shadow-md'}>
        {props.type === 'image' && (
          <img
            src={props.imageUrl}
            alt={props.answer}
            className={`${props.size}`}
          />
        )}
      </div>
    </div>
  );
}
