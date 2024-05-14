import { Button } from '@/shared/ui';

export function OXTypeBtn(props: { padding: string; size: string }) {
  const handleSubmitAnswer = (answer: string) => {
    answer;
  };
  const handleSubmitPass = () => {};

  return (
    <div className={`flex justify-between ${props.padding} ${props.size}`}>
      <div className={``}>
        <Button
          className={'h-24 w-32'}
          value="O"
          onClick={() => handleSubmitAnswer('O')}
        />
        <Button
          className={'h-24 w-32'}
          value="X"
          onClick={() => handleSubmitAnswer('X')}
        />
      </div>
      <div>
        <Button
          className={'h-24 w-20'}
          value="패스"
          onClick={handleSubmitPass}
        />
      </div>
    </div>
  );
}
