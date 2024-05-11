/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEnterRoomQuery } from '../hooks/useEnterRoomQuery';
import { RoomContent, RoomHeader } from '.';

export function WaitingRoomPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const {
    data: waitingRoom,
    isError: isWaitingRoomError,
    isLoading: isWaitingRoomLoading,
  } = useEnterRoomQuery(Number(roomId));

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className={'h-screen w-screen'}>
      {isWaitingRoomError && <div>해당 게임의 정보를 불러올 수 없습니다.</div>}
      {isWaitingRoomLoading && <div>Loading . . .</div>}
      {!isWaitingRoomLoading && !waitingRoom && (
        <div>해당 게임의 정보가 없습니다.</div>
      )}
      {!isWaitingRoomLoading &&
        waitingRoom &&
        waitingRoom.roomInfo.roomId != -1 && (
          <div>
            <RoomHeader
              channelId={Number(channelId)}
              roomInfo={waitingRoom.roomInfo}
            />
            <RoomContent
              channelId={Number(channelId)}
              waitingRoom={waitingRoom}
            />
          </div>
        )}
    </div>
  );
}
