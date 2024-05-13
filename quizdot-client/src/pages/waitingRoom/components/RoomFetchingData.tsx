/* eslint-disable @typescript-eslint/no-unused-vars */
import { RoomContent, RoomHeader } from '.';
import { useEnterRoomQuery } from '../hooks/useEnterRoomQuery';

export function RoomFetchingData({
  channelId,
  roomId,
}: {
  channelId: number;
  roomId: number;
}) {
  const {
    data: waitingRoom,
    isError: isWaitingRoomError,
    isLoading: isWaitingRoomLoading,
  } = useEnterRoomQuery(roomId);

  return (
    <div>
      {isWaitingRoomError && <div>해당 게임의 정보를 불러올 수 없습니다.</div>}
      {isWaitingRoomLoading && <div>Loading . . .</div>}
      {!isWaitingRoomLoading && !waitingRoom && (
        <div>해당 게임의 정보가 없습니다.</div>
      )}
      {!isWaitingRoomLoading &&
        waitingRoom &&
        waitingRoom.roomInfo.roomId != -1 && (
          <div>
            <RoomHeader channelId={channelId} roomInfo={waitingRoom.roomInfo} />
            <RoomContent waitingRoom={waitingRoom} />
          </div>
        )}
    </div>
  );
}
