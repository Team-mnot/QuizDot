import { Modal } from '@/shared/ui';
import { useOpenModal } from '@/shared/hooks';
import { useContext, useEffect, useState } from 'react';
import { Character } from '@/shared/ui/Character';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useGameStore } from '@/shared/stores/connectionStore/gameStore';
import { MessageDto } from '@/shared/apis/types';

export function PlayerList({ roomId }: { roomId: number }) {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();
  const [clickedUserId, setClickedUserId] = useState<string>('');

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);
  const gameStore = useGameStore();
  const [playersCount, setPlayersCount] = useState<number>(
    Object.keys(gameStore.players).length,
  );

  const callbackOfPlayers = async (message: MessageDto) => {
    if (message.type === 'ENTER') {
      gameStore.enteredPlayer(message.data.id, {
        level: message.data.level,
        nickname: message.data.nickname,
        nicknameColor: message.data.nicknameColor,
        title: message.data.title,
        characterId: message.data.characterId,
      });
      setPlayersCount(playersCount + 1);
    } else if (message.type === 'LEAVE') {
      gameStore.leavedPlayer(message.data);
      setPlayersCount(playersCount - 1);
    }
  };

  useEffect(() => {
    onSubscribeWithCallBack(`players/room/${roomId}`, callbackOfPlayers);

    return () => {
      onUnsubscribe(`players/room/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {}, [gameStore.players]);

  return (
    <div className="flex justify-between">
      <div>
        {gameStore.players &&
          Object.entries(gameStore.players)
            .slice(0, (playersCount + 1) / 2)
            .map(([key, player]) => (
              <div
                key={key}
                onClick={() => {
                  setClickedUserId(key);
                  clickModal();
                }}
              >
                <Character
                  title={player.title}
                  nickname={player.nickname}
                  nicknameColor={player.nicknameColor}
                  level={player.level}
                  characterId={player.characterId}
                />
              </div>
            ))}
      </div>
      <div>
        {gameStore.players &&
          Object.entries(gameStore.players)
            .slice((playersCount + 1) / 2, playersCount)
            .map(([key, player]) => (
              <div
                key={key}
                onClick={() => {
                  setClickedUserId(key);
                  clickModal();
                }}
              >
                <Character
                  title={player.title}
                  nickname={player.nickname}
                  nicknameColor={player.nicknameColor}
                  level={player.level}
                  characterId={player.characterId}
                />
              </div>
            ))}
      </div>
      <Modal isOpen={isOpenModal} onClose={closeModal}>
        <div className={'h-96 w-96'}>{clickedUserId}</div>
      </Modal>
    </div>
  );
}
