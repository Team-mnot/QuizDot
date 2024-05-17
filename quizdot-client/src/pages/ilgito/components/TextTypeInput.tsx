import { Button, Input } from '@/shared/ui';
import { useState } from 'react';

export function TextTypeInput({
  handleSubmitPass,
  handleSubmitAnswer,
}: {
  handleSubmitPass: () => void;
  handleSubmitAnswer: (answer: string) => void;
}) {
  const [answer, setAnswer] = useState('');
  const inputAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.currentTarget.value);
  };

  const submitPass = () => {
    handleSubmitPass();
  };

  const submitAnswer = (myAns: string) => {
    handleSubmitAnswer(myAns);
    setAnswer('');
  };

  return (
    <div className="flex h-24 w-[500px] justify-between py-20">
      <div>
        <Input
          className="h-12 w-72"
          type="text"
          placeholder="정답을 입력하세요"
          value={answer}
          onChange={inputAnswer}
          onKeyDown={(e) => e.key === 'Enter' && submitAnswer(answer)}
        />
      </div>
      <div>
        <Button className="h-12 w-20" value="패스" onClick={submitPass} />
      </div>
    </div>
  );
}
