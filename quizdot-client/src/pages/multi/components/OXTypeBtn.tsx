import { Button } from '@/shared/ui';

export function OXTypeBtn({
  handleSubmitPass,
  handleSubmitAnswer,
}: {
  handleSubmitPass: () => void;
  handleSubmitAnswer: (answer: string) => void;
}) {
  return (
    <div className="flex h-24 w-[500px] justify-between py-20">
      <div>
        <Button
          className="h-24 w-32"
          value="O"
          onClick={() => handleSubmitAnswer('O')}
        />
        <Button
          className="h-24 w-32"
          value="X"
          onClick={() => handleSubmitAnswer('X')}
        />
      </div>
      <div>
        <Button className="h-24 w-20" value="패스" onClick={handleSubmitPass} />
      </div>
    </div>
  );
}
