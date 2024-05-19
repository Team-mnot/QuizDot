// src/pages/survival/components/CharacterPreview.tsx

// import { getPlayerData } from '../api/api';
import { PlayerInSurvivalModeComponent } from './PlayerInSurvivalModeComponent';
import { usePlayerStore } from '../store';

// 미리 지정된 위치 정보
export const predefinedPositions = [
  { id: 'grid-item-1', position: { top: 20, left: 5 } },
  { id: 'grid-item-2', position: { top: 20, left: 13 } },
  { id: 'grid-item-3', position: { top: 20, left: 21 } },
  { id: 'grid-item-4', position: { top: 20, left: 79 } },
  { id: 'grid-item-5', position: { top: 20, left: 87 } },
  { id: 'grid-item-6', position: { top: 20, left: 95 } },
  { id: 'grid-item-7', position: { top: 50, left: 5 } },
  { id: 'grid-item-8', position: { top: 50, left: 13 } },
  { id: 'grid-item-9', position: { top: 50, left: 21 } },
  { id: 'grid-item-10', position: { top: 50, left: 79 } },
  { id: 'grid-item-11', position: { top: 50, left: 87 } },
  { id: 'grid-item-12', position: { top: 50, left: 95 } },
  { id: 'grid-item-13', position: { top: 80, left: 5 } },
  { id: 'grid-item-14', position: { top: 80, left: 13 } },
  { id: 'grid-item-15', position: { top: 80, left: 21 } },
  { id: 'grid-item-16', position: { top: 80, left: 79 } },
  { id: 'grid-item-17', position: { top: 80, left: 87 } },
  { id: 'grid-item-18', position: { top: 80, left: 95 } },
];

export function PlayerPreview() {
  const players = usePlayerStore((state) => state.players);
  // console.log(players);

  return (
    <div>
      {players.map((player, index) => (
        <PlayerInSurvivalModeComponent
          key={index}
          characterId={player.characterId}
          title={player.title}
          nickname={player.nickname}
          nicknameColor={player.nicknameColor}
          level={player.level}
          position={predefinedPositions[index]?.position}
          isAlive={player.isAlive}
          isRevive={player.isRevive}
        />
      ))}
    </div>
  );
}
