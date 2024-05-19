import { useContext, useEffect } from 'react';
import { Character } from '@/shared/ui/Character';

import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { MessageDto } from '@/shared/apis/types';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';

export function Players() {
  const roomStore = useRoomStore();
  const quizSetStore = useQuizSetStore();

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  const callbackOfPlayers = async (message: MessageDto) => {
    console.log('PLAYERS: ', message);
    if (message.type == 'LEAVE') {
      roomStore.leavedPlayer(message.data);
    }
  };

  useEffect(() => {}, [quizSetStore]);

  useEffect(() => {
    onSubscribeWithCallBack(
      `players/room/${roomStore.roomInfo!.roomId}`,
      callbackOfPlayers,
    );

    return () => {
      onUnsubscribe(`players/room/${roomStore.roomInfo!.roomId}`);
    };
  }, [isReady]);

  return (
    <div className="flex justify-between w-full">
      {roomStore.players &&
        Object.entries(roomStore.players).map(([key, player]) => (
          <div key={key}>
            <Character
              title={player.title}
              nickname={player.nickname}
              nicknameColor={player.nicknameColor}
              level={player.level}
              characterId={player.characterId}
            />
            <p>
              체력&nbsp;:&nbsp;
              {quizSetStore.scores[Number(key)]
                ? quizSetStore.scores[Number(key)]
                : 10}
            </p>
          </div>
        ))}
    </div>
  );
}
