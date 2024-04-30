import { Button } from '@/shared/ui';

interface PropsWithSize {
  padding: string;
  size: string;
}

export function OXButtonComponent(props: PropsWithSize) {
  const handleClickTrue = () => {};
  const handleClickFalse = () => {};
  const handleClickPass = () => {};

  return (
    <div className={`flex justify-between ${props.padding} ${props.size}`}>
      <div className={``}>
        <Button className={'h-24 w-32'} value="O" onClick={handleClickTrue} />
        <Button className={'h-24 w-32'} value="X" onClick={handleClickFalse} />
      </div>
      <div>
        <Button
          className={'h-24 w-20'}
          value="패스"
          onClick={handleClickPass}
        />
      </div>
    </div>
  );
}
