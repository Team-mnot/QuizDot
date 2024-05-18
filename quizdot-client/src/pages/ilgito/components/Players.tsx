import { useContext, useEffect } from 'react';
import { Character } from '@/shared/ui/Character';

import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { MessageDto } from '@/shared/apis/types';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useQuizSetStore } from '@/shared/stores/connectionStore/quizSetStore';

export function Players({ roomId }: { roomId: number }) {
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

  useEffect(() => {
    onSubscribeWithCallBack(`players/room/${roomId}`, callbackOfPlayers);

    return () => {
      onUnsubscribe(`players/room/${roomId}`);
    };
  }, [isReady]);

  return (
    <div className="flex justify-between">
      <div>
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
                point:{' '}
                {quizSetStore.scores[Number(key)]
                  ? quizSetStore.scores[Number(key)]
                  : 0}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}
