/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomFetchingData } from './RoomFetchingData';

export function WaitingRoomPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className={'h-screen w-screen'}>
      <RoomFetchingData channelId={Number(channelId)} roomId={Number(roomId)} />
    </div>
  );
}
