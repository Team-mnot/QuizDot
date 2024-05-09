import { useEffect } from 'react';
import { CharacterPreview } from './CharacterPreview';

export function WaitingRoomPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <div className="flex h-screen w-screen justify-center ">
        <h1 className="py-10">Waiting Room</h1>
      </div>
      <CharacterPreview />
    </div>
  );
}
