import { Button, Input } from '@/shared/ui';
import { useState } from 'react';

interface PropsWithSize {
  padding: string;
  size: string;
}

export function TextInputComponent(props: PropsWithSize) {
  const [answer, setAnswer] = useState('');

  const handleInputAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.currentTarget.value);
  };

  const handleClickPass = () => {};

  return (
    <div className={`flex justify-between ${props.padding} ${props.size}`}>
      <div>
        <Input
          className={'h-12 w-72'}
          type="text"
          placeholder="정답을 입력하세요"
          value={answer}
          onChange={handleInputAnswer}
        />
      </div>
      <div>
        <Button
          className={'h-12 w-20'}
          value="패스"
          onClick={handleClickPass}
        />
      </div>
    </div>
  );
}
