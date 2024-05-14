import { useContext, useEffect } from 'react';
import { EnteringRoomType } from '@/pages/waitingRoom/api/types';
import { PlayerList } from './PlayerList';
import { RoomChattingBox } from './RoomChattingBox';
import { QuizPreview } from './QuizPreview';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

export function RoomContent({
  waitingRoom,
}: {
  waitingRoom: EnteringRoomType;
}) {
  // const playerKeys = Object.keys(temp.players);
  // const userStore = useUserStore();

  const { isReady, onSubscribe, onUnsubscribe } = useContext(WebSocketContext);

  useEffect(() => {
    onSubscribe(`chat/room/${waitingRoom.roomInfo.roomId}`);
    onSubscribe(`info/room/${waitingRoom.roomInfo.roomId}`);
    onSubscribe(`players/room/${waitingRoom.roomInfo.roomId}`);

    return () => {
      onUnsubscribe(`chat/room/${waitingRoom.roomInfo.roomId}`);
      onUnsubscribe(`info/room/${waitingRoom.roomInfo.roomId}`);
      onUnsubscribe(`players/room/${waitingRoom.roomInfo.roomId}`);
    };
  }, [isReady]);

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
