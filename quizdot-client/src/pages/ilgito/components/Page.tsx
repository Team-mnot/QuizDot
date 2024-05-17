import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomHeader } from './RoomHeader';
import { RoomContent } from './RoomContent';

export function IlgitoPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <RoomHeader channelId={Number(channelId)} roomId={Number(roomId)} />
      <RoomContent roomId={Number(roomId)} channelId={Number(channelId)} />
    </div>
  );
}
