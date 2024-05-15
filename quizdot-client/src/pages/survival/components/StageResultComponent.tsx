// src/pages/survival/components/StageResultComponent.tsx

import { GameResult } from '../api/types';

interface StageResultComponentProps {
  resultData: GameResult[];
}

export function StageResultComponent({
  resultData,
}: StageResultComponentProps) {
  return (
    <div className="result-container">
      <h2>Stage Result</h2>
      <ul>
        {resultData.map((player, index) => (
          <li key={index}>
            Player PK: {player.value}, Score: {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
}
