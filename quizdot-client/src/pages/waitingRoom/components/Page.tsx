/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomFetchData } from './RoomFetchData';

export function WaitingRoomPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  useEffect(() => {
    document.body.style.backgroundImage =
      'url(/images/WaitingBackground02.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="max-w-screen max-h-screen">
      <RoomFetchData channelId={Number(channelId)} roomId={Number(roomId)} />
    </div>
  );
}
