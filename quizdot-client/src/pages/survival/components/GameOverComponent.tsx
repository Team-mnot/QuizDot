// src/pages/survival/components/GameOverComponent.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { GameResult } from '../api/types';
import { useEffect } from 'react';

interface GameOverComponentProps {
  resultData: GameResult[];
}

export function GameOverComponent({ resultData }: GameOverComponentProps) {
  const navigate = useNavigate();
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/${channelId}/${roomId}/waiting`);
    }, 10000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, [navigate, channelId, roomId]);

  return (
    <div className="game-over-container">
      <h1>게임이 끝났다 우매한 중생들아</h1>
      <h2>대기실로 돌아가거라 당장 썩 사라져라</h2>
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
