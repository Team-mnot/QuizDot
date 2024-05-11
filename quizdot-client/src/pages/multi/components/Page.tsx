import { useEffect } from 'react';
import { RoomHeader } from './RoomHeader';
import { QuizPreview } from './QuizPreview';
import { CharacterPreview } from './CharacterPreview';

export function MultiPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <RoomHeader />
      <CharacterPreview />
      <QuizPreview />
    </div>
  );
}
