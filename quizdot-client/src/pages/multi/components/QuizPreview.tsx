// import { Progress } from '@/shared/ui';
// import { Quiz } from './Quiz';
// import { useEffect, useRef, useState } from 'react';
// import { Answer } from './Answer';
// import { QuizType } from '../api/types';

// import { TextTypeInput } from './TextTypeInput';
// import { OXTypeBtn } from './OXTypeBtn';
export function QuizPreview() {
  // // 문제 리스트
  // const quizList = useRef<QuizType[]>([]);
  // // 현재 문제 리스트의 인덱스
  // const quizIndex = useRef<number>(0);
  // // 타이머
  // const secCount = useRef<number>(0);
  // // 퀴즈 활성화 확인
  // const isShowQuiz = useRef<boolean>(false);
  // // 답변 제출 확인
  // const isSubmitAnswer = useRef<boolean>(false);
  // // 힌트 활성화 확인
  // const isShowHint = useRef<boolean>(false);
  // // 정답 및 해설 활성화 확인
  // const isShowAnswer = useRef<boolean>(false);
  // // 문제 패스
  // const handlePassOfQuiz = () => {};
  // // 해설 패스
  // const handlePassOfAnswer = () => {};

  return (
    <div className={'absolute left-0 top-[60px] w-full'}>
      {/* <div>
        {isShowQuiz && (
          <Quiz
            padding={'py-5'}
            size={'h-28 w-[500px]'}
            question={quizList.current[quizIndex.current].question}
            category={quizList.current[quizIndex.current].category}
          ></Quiz>
        )}

        <Progress
          padding={'py-5'}
          size={'w-[500px]'}
          color={dummyTimer.currentValue <= 5 ? 'yellow' : 'pink'}
          label={`${dummyTimer.currentValue}`}
          currentValue={dummyTimer.currentValue}
          maxValue={dummyTimer.maxValue}
        ></Progress>

        {isShowAnswer && (
          <Answer
            padding={'py-5'}
            size={'h-[300px] w-[500px]'}
            sec={dummyTimer.currentValue}
            hint={quizList.current[quizIndex.current].hint}
            imageUrl={quizList.current[quizIndex.current].hint}
            type={quizList.current[quizIndex.current].questionType}
            answers={quizList.current[quizIndex.current].answers}
            description={quizList.current[quizIndex.current].description}
          />
        )}
      </div> */}
      {/* {quizList.current[quizIndex.current].questionType == 'ox' ? (
        <OXTypeBtn padding={'py-20'} size={'h-24 w-[500px]'} />
      ) : (
        <TextTypeInput padding={'py-20'} size={'h-24 w-[500px]'} />
      )} */}
    </div>
  );
}
