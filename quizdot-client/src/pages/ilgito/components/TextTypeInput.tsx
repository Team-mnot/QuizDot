import { useRef, useState, useEffect } from 'react';

export function TextTypeInput({
  handleSubmitAnswer,
}: {
  handleSubmitAnswer: (answer: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const [answer, setAnswer] = useState('');
  const inputAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.currentTarget.value);
  };

  const submitAnswer = (myAns: string) => {
    handleSubmitAnswer(myAns);
    setAnswer('');
  };

  return (
    <div className="absolute top-[620px] flex h-24 w-[500px] justify-between py-20">
      <div>
        <input
          ref={inputRef}
          className="h-12 w-[360px] rounded-md border-2 bg-white px-[20px] py-[10px] shadow-md"
          type="text"
          placeholder="정답을 입력하세요"
          value={answer}
          onChange={inputAnswer}
          onKeyDown={(e) => e.key === 'Enter' && submitAnswer(answer)}
        />
      </div>
    </div>
  );
}
