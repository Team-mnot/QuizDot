import { useContext, useEffect, useState } from 'react';
import { Character } from '@/shared/ui/Character';

import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { PlayerType, PlayersType } from '../api/types';

export function PlayerList(props: { players: PlayersType }) {
  // useRef 를 써야 할까요?
  const [players, setPlayers] = useState<PlayersType>(props.players);
  const [playersCount, setPlayersCount] = useState<number>(
    Object.keys(players).length,
  );

  // 로딩 때문에 깜빡거리는 문제 해결하기
  const { callbackMsg } = useContext(WebSocketContext);

  useEffect(() => {
    if (callbackMsg && callbackMsg.type == 'ENTER') {
      setPlayersCount(playersCount + 1);
      setPlayers((players: PlayersType) => {
        return {
          ...players,
          [String(playersCount)]: callbackMsg.data as PlayerType,
        };
      });
    }
  }, [callbackMsg, players]);

  return (
    <div>
      {players &&
        Object.entries(players).map(([key, player]) => (
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
  );
}
