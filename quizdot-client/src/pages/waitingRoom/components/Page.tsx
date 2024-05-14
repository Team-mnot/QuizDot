/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { EnteringRoomType } from '../api/types';
import { RoomContent, RoomHeader } from '.';

export function WaitingRoomPage() {
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
