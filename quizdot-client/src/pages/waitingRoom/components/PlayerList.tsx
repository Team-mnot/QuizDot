import { Modal } from '@/shared/ui';
import { useOpenModal } from '@/shared/hooks';
import { useContext, useEffect, useRef, useState } from 'react';
import { Character } from '@/shared/ui/Character';

import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { PlayersType } from '@/pages/waitingRoom/api/types';

export function PlayerList(props: { roomId: number; players: PlayersType }) {
  // useRef 를 써야 할까요?
  const players = useRef<PlayersType>(props.players);
  const playersCount = useRef<number>(Object.keys(players).length);

  const { isOpenModal, clickModal, closeModal } = useOpenModal();
  const [clickedUserId, setClickedUserId] = useState<string>('');

  // 로딩 때문에 깜빡거리는 문제 해결하기
  const { callbackMsg } = useContext(WebSocketContext);

  useEffect(() => {
    const msg = callbackMsg.msg;
    const address = callbackMsg.address;

    if (address == `players/room/${props.roomId}`) {
      if (msg.type == 'ENTER') {
        players.current[Object.keys(msg.data)[0]] = msg.data;
        playersCount.current = Object.keys(players.current).length;
      } else if (msg.type == 'LEAVE') {
        delete players.current[msg.data];
        playersCount.current = Object.keys(players.current).length;
      }
    }
  }, [callbackMsg, players]);

  return (
    <div className="flex justify-between">
      <div>
        {players.current &&
          Object.entries(players.current)
            .slice(0, (playersCount.current + 1) / 2)
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
        {players.current &&
          Object.entries(players.current)
            .slice((playersCount.current + 1) / 2, playersCount.current)
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
