import { Button, Input } from '@/shared/ui';
import { useState } from 'react';

export function TextTypeInput(props: { padding: string; size: string }) {
  const [answer, setAnswer] = useState('');

  const inputAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.currentTarget.value);
  };

  const passQuestion = () => {};

  return (
    <div className={`flex justify-between ${props.padding} ${props.size}`}>
      <div>
        <Input
          className={'h-12 w-72'}
          type="text"
          placeholder="정답을 입력하세요"
          value={answer}
          onChange={inputAnswer}
        />
      </div>
      <div>
        <Button className={'h-12 w-20'} value="패스" onClick={passQuestion} />
      </div>
    </div>
  );
}
