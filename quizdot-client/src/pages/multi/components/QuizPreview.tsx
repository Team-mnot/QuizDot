import { Progress } from '@/shared/ui';
import { Quiz } from './Quiz';
import { useEffect, useState } from 'react';
import { Answer } from './Answer';
import { TextTypeInput } from './TextTypeInput';
import { OXTypeBtn } from './OXTypeBtn';

export function QuizPreview() {
  const [dummyIndex, setDummyIndex] = useState(0);

  useEffect(() => {
    setDummyIndex(0);
  }, []);

  const dummyQuestions = [
    {
      question: '캐나다의 수도는?',
      category: '상식',
      hint: 'ㅇㅌㅇ',
      imageUrl: '/images/unnamed.png',
      type: 'image',
      answer: '오타와',
      description: '그렇다네요',
    },
    {
      question: '문제2',
      category: '시사',
      hint: 'ㅈㄷ1',
      imageUrl: '/images/unnamed.png',
      type: 'image',
      answer: '정답2',
      description: '설명2',
    },
  ];

  const dummyTimer = {
    currentValue: 4,
    maxValue: 10,
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: '50%',
      }}
      className={'-translate-x-1/2 transform p-5'}
    >
      <div>
        <Quiz
          padding={'py-5'}
          size={'h-28 w-[500px]'}
          question={dummyQuestions[dummyIndex].question}
          category={dummyQuestions[dummyIndex].category}
        ></Quiz>

        <Progress
          padding={'py-5'}
          size={'w-[500px]'}
          color={dummyTimer.currentValue <= 5 ? 'yellow' : 'pink'}
          label={`${dummyTimer.currentValue}`}
          currentValue={dummyTimer.currentValue}
          maxValue={dummyTimer.maxValue}
        ></Progress>

        <Answer
          padding={'py-5'}
          size={'h-[300px] w-[500px]'}
          sec={dummyTimer.currentValue}
          hint={dummyQuestions[dummyIndex].hint}
          imageUrl={dummyQuestions[dummyIndex].imageUrl}
          type={dummyQuestions[dummyIndex].type}
          answer={dummyQuestions[dummyIndex].answer}
          description={dummyQuestions[dummyIndex].description}
        />
      </div>
      {dummyQuestions[dummyIndex].type == 'ox' ? (
        <OXTypeBtn padding={'py-20'} size={'h-24 w-[500px]'} />
      ) : (
        <TextTypeInput padding={'py-20'} size={'h-24 w-[500px]'} />
      )}
    </div>
  );
}
