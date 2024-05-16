import { useContext, useEffect, useRef } from 'react';
import { Character } from '@/shared/ui/Character';

import { useGameStore } from '@/shared/stores/connectionStore/gameStore';
import { MessageDto } from '@/shared/apis/types';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

export function Players({ roomId }: { roomId: number }) {
  const gameStore = useGameStore();
  const playersCount = useRef<number>(Object.keys(gameStore.players).length);

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);

  const callbackOfPlayers = async (message: MessageDto) => {
    console.log('PLAYERS: ', message);
    if (message.type == 'LEAVE') {
      gameStore.leavedPlayer(message.data);
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
        {gameStore.players &&
          Object.entries(gameStore.players)
            .slice(0, (playersCount.current + 1) / 2)
            .map(([key, player]) => (
              <Character
                key={key}
                title={player.title}
                nickname={player.nickname}
                nicknameColor={player.nicknameColor}
                level={player.level}
                characterId={player.characterId}
              />
            ))}
      </div>
      <div>
        {gameStore.players &&
          Object.entries(gameStore.players)
            .slice((playersCount.current + 1) / 2, playersCount.current)
            .map(([key, player]) => (
              <Character
                key={key}
                title={player.title}
                nickname={player.nickname}
                nicknameColor={player.nicknameColor}
                level={player.level}
                characterId={player.characterId}
              />
            ))}
      </div>
    </div>
  );
}
