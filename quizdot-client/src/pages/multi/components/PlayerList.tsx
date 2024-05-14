import { Modal } from '@/shared/ui';
import { useOpenModal } from '@/shared/hooks';
import { useContext, useEffect, useState } from 'react';
import { Character } from '@/shared/ui/Character';

import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { PlayerType, PlayersType } from '@/pages/waitingRoom/api/types';

export function PlayerList(props: { roomId: number; players: PlayersType }) {
  // useRef 를 써야 할까요?
  const [players, setPlayers] = useState<PlayersType>(props.players);
  const [playersCount, setPlayersCount] = useState<number>(
    Object.keys(players).length,
  );

  const { isOpenModal, clickModal, closeModal } = useOpenModal();
  const [clickedUserId, setClickedUserId] = useState<string>('');

  // 로딩 때문에 깜빡거리는 문제 해결하기
  const { callbackMsg } = useContext(WebSocketContext);

  useEffect(() => {
    if (
      callbackMsg.msg &&
      callbackMsg.address == `players/room/${props.roomId}` &&
      callbackMsg.msg.type == 'ENTER'
    ) {
      setPlayersCount(playersCount + 1);
      setPlayers((players: PlayersType) => {
        return {
          ...players,
          [String(playersCount)]: callbackMsg.msg.data as PlayerType,
        };
      });
    }
  }, [callbackMsg, players]);

  return (
    <div>
      <div>
        {players &&
          Object.entries(players)
            .slice(0, Object.entries(players).length - 4)
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
        {Object.entries(players).length > 4 &&
          Object.entries(players)
            .slice(4, Object.entries(players).length)
            .map(([key, player]) => (
              <div
                key={key}
                onClick={() => {
                  setClickedUserId(key);
                  clickModal();
                }}
              >
                <Character
                  key={key}
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
