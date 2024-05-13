import { useContext, useEffect, useState } from 'react';
import { PlayerList, RoomChattingBox } from '.';

import { EnteringRoomType } from '../api/types';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

export function RoomContent({
  waitingRoom,
}: {
  waitingRoom: EnteringRoomType;
}) {
  // const playerKeys = Object.keys(temp.players);
  // const userStore = useUserStore();

  useState<EnteringRoomType>(waitingRoom);

  // 로딩 때문에 깜빡거리는 문제 해결하기
  const { isReady, onSubscribe } = useContext(WebSocketContext);

  useEffect(() => {
    onSubscribe(`chat/room/${waitingRoom.roomInfo.roomId}`);
    onSubscribe(`info/room/${waitingRoom.roomInfo.roomId}`);
    onSubscribe(`players/room/${waitingRoom.roomInfo.roomId}`);
  }, [isReady]);

  return (
    <div className={'absolute left-[0px] top-[70px] w-full p-[30px]'}>
      <div>
        <PlayerList players={waitingRoom.players} />
      </div>
      <div>
        <RoomChattingBox roomId={waitingRoom.roomInfo.roomId} />
      </div>
    </div>
  );
}
