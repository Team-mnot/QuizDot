// src/pages/survival/components/CharacterPreview.tsx

import { getCharacterData } from '../api/api';
import { CharacterInSurvivalModeComponent } from './CharacterInSurvivalModeComponent';

// 미리 지정된 위치 정보
const predefinedPositions = [
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

export function CharacterPreview() {
  // 더미 캐릭터 데이터
  const characterData = getCharacterData();

  return (
    <div>
      {characterData.map((character, index) => (
        <CharacterInSurvivalModeComponent
          key={index}
          imageUrl={character.imageUrl}
          title={character.title}
          nickname={character.nickname}
          score={character.score}
          position={predefinedPositions[index].position} // 미리 지정된 위치 정보 사용
          isAlive={character.isAlive}
          isRevive={character.isRevive}
        />
      ))}
    </div>
  );
}
