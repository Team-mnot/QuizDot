import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { EnteringRoomType } from '@/pages/waitingRoom/api/types';
import { RoomHeader } from './RoomHeader';
import { RoomContent } from './RoomContent';

export function MultiPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };
  roomId;
  const location = useLocation();
  const waitingRoomInfo = useRef<EnteringRoomType>(location.state);

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <RoomHeader
        channelId={Number(channelId)}
        roomInfo={waitingRoomInfo.current.roomInfo}
      />
      <RoomContent waitingRoom={waitingRoomInfo.current} />
    </div>
  );
}
