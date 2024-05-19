import { useEffect } from 'react';
import { RoomHeader } from './RoomHeader';
import { RoomContent } from './RoomContent';

export function MultiPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <RoomHeader />
      <RoomContent />
    </div>
  );
}
