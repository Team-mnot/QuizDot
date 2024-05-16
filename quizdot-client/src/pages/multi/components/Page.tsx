import { useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { RoomHeader } from './RoomHeader';
import { RoomContent } from './RoomContent';
import { QuizSetType } from '../api/types';

export function MultiPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const location = useLocation();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <RoomHeader channelId={Number(channelId)} roomId={Number(roomId)} />
      <RoomContent
        quizSet={location.state as QuizSetType[]}
        roomId={Number(roomId)}
        channelId={Number(channelId)}
      />
    </div>
  );
}
