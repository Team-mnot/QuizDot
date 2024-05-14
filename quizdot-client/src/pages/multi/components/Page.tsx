import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomFetchingData } from './RoomFetchingData';

export function MultiPage() {
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
      <RoomFetchingData channelId={Number(channelId)} roomId={Number(roomId)} />
    </div>
  );
}
