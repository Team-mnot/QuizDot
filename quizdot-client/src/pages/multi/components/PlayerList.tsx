import { useContext, useEffect, useRef } from 'react';
import { Character } from '@/shared/ui/Character';

import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { PlayersType } from '@/pages/waitingRoom/api/types';

export function PlayerList(props: { roomId: number; players: PlayersType }) {
  // useRef 를 써야 할까요?
  const players = useRef<PlayersType>(props.players);
  const playersCount = useRef<number>(Object.keys(players).length);

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
        {players.current &&
          Object.entries(players.current)
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
