import { Modal } from '@/shared/ui';
import { useOpenModal } from '@/shared/hooks';
import { useContext, useEffect, useState } from 'react';
import { Character } from '@/shared/ui/Character';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
import { MessageDto } from '@/shared/apis/types';
import { UserInfo } from '@/widgets/userInfo';

export function PlayerList({ roomId }: { roomId: number }) {
  const { isOpenModal, clickModal, closeModal } = useOpenModal();
  const [clickedUserId, setClickedUserId] = useState<string>('');

  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);
  const roomStore = useRoomStore();
  const [playersCount, setPlayersCount] = useState<number>(
    Object.keys(roomStore.players).length,
  );

  const callbackOfPlayers = async (message: MessageDto) => {
    if (message.type === 'ENTER') {
      roomStore.enteredPlayer(message.data.id, {
        level: message.data.level,
        nickname: message.data.nickname,
        nicknameColor: message.data.nicknameColor,
        title: message.data.title,
        characterId: message.data.characterId,
      });
      setPlayersCount((prevCnt) => {
        return prevCnt + 1;
      });
    } else if (message.type === 'LEAVE') {
      roomStore.leavedPlayer(message.data);
      setPlayersCount((prevCnt) => {
        return prevCnt - 1;
      });
    }
  };

  useEffect(() => {
    onSubscribeWithCallBack(`players/room/${roomId}`, callbackOfPlayers);

    return () => {
      onUnsubscribe(`players/room/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {}, [roomStore.players]);

  return (
    <div className="flex justify-between">
      <div>
        {roomStore.players &&
          Object.entries(roomStore.players)
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
        {roomStore.players &&
          Object.entries(roomStore.players)
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
        <UserInfo id={Number(clickedUserId)}></UserInfo>
      </Modal>
    </div>
  );
}
