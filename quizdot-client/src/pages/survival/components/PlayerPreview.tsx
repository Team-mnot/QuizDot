// src/pages/survival/components/CharacterPreview.tsx

// import { getPlayerData } from '../api/api';
import { PlayerInSurvivalModeComponent } from './PlayerInSurvivalModeComponent';
import { usePlayerStore } from '../store';

// 미리 지정된 위치 정보
export const predefinedPositions = [
  { id: 'grid-item-1', position: { top: 20, left: 10 } },
  { id: 'grid-item-2', position: { top: 20, left: 20 } },
  { id: 'grid-item-3', position: { top: 50, left: 30 } },
  { id: 'grid-item-4', position: { top: 50, left: 40 } },
  { id: 'grid-item-5', position: { top: 50, left: 50 } },
  { id: 'grid-item-6', position: { top: 50, left: 60 } },
  { id: 'grid-item-7', position: { top: 50, left: 70 } },
  { id: 'grid-item-8', position: { top: 50, left: 80 } },
  { id: 'grid-item-9', position: { top: 50, left: 90 } },
  { id: 'grid-item-10', position: { top: 16, left: 82 } },
  { id: 'grid-item-11', position: { top: 66, left: 86 } },
  { id: 'grid-item-12', position: { top: 0, left: 0 } },
  { id: 'grid-item-13', position: { top: 0, left: 0 } },
  { id: 'grid-item-14', position: { top: 0, left: 0 } },
  { id: 'grid-item-15', position: { top: 0, left: 0 } },
  { id: 'grid-item-16', position: { top: 0, left: 0 } },
  { id: 'grid-item-17', position: { top: 0, left: 0 } },
  { id: 'grid-item-18', position: { top: 0, left: 0 } },
];

export function PlayerPreview() {
  const players = usePlayerStore((state) => state.players);

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
