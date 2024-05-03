import { useEffect } from 'react';
import { Button } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';

export function ChannelPage() {
  const navi = useNavigate();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  const handleClickChannel = (channel: number) => {
    navi(`/${channel}/lobby`, { replace: true });
  };

  return (
    <div
      className={
        'flex h-screen w-screen flex-col items-center justify-center text-center'
      }
    >
      <h1>채널</h1>
      <Button value={'1채널'} onClick={() => handleClickChannel(1)} />
      <Button value={'2채널'} />
      <Button value={'3채널'} />
      <Button value={'4채널'} />
      <Button value={'5채널'} />
      <Button value={'6채널'} />
      <Button value={'7채널'} />
      <Button value={'8채널'} />
      <Button value={'9채널'} />
      <Button value={'10채널'} />
    </div>
  );
}
