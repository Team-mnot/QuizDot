import { useState } from 'react';
import { EnteringRoomType } from '@/pages/waitingRoom/api/types';
import { PlayerList } from './PlayerList';
import { RoomChattingBox } from './RoomChattingBox';
import { QuizPreview } from './QuizPreview';

export function RoomContent({
  waitingRoom,
}: {
  waitingRoom: EnteringRoomType;
}) {
  // const playerKeys = Object.keys(temp.players);
  // const userStore = useUserStore();

  useState<EnteringRoomType>(waitingRoom);

  return (
    <div className={'absolute left-[0px] top-[70px] w-full p-[30px]'}>
      <div>
        <PlayerList
          players={waitingRoom.players}
          roomId={waitingRoom.roomInfo.roomId}
        />
      </div>
      <div>
        <QuizPreview />
      </div>
      <div>
        <RoomChattingBox roomId={waitingRoom.roomInfo.roomId} />
      </div>
    </div>
  );
}
