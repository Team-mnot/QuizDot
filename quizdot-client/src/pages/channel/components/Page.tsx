import { useEffect } from 'react';
import { Button } from '@/shared/ui';

export function ChannelPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center text-center">
      <h1>채널</h1>
      <Button value={'1채널'} />
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
