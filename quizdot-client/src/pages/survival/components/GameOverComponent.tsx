// src/pages/survival/components/GameOverComponent.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { enterRoomApi } from '@/pages/waitingRoom/api/api';
import { useUserStore } from '@/shared/stores/userStore/userStore';
// import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';
import { useGameStore } from '@/shared/stores/connectionStore/gameStore';
import { useQuizStore } from '../store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GameOverComponent({ rewardData }: { rewardData: any[] }) {
  const navigate = useNavigate();
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const gameStore = useGameStore();
  const userStore = useUserStore();
  const { setIsGameOver } = useQuizStore();
  const [countdown, setCountdown] = useState(10); // 10초 카운트다운 초기값 설정
  const originRoomId = gameStore.roomInfo?.roomId
    ? gameStore.roomInfo.roomId
    : 0;
  const originChannelId = Math.floor(originRoomId / 1000); // 1000으로 나눈 몫의 정수 부분만 가져옴

  useEffect(() => {
    // 1초마다 카운트다운 감소
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // 10초 후 대기실로 이동
    const timeout = setTimeout(() => {
      navigate(`/${originChannelId}/${gameStore.roomInfo?.roomId}/waiting`);
      setIsGameOver(false); // 다시 false 해놔야 다음게임때 문제 X
    }, 10000);

    return () => {
      clearInterval(timer); // 컴포넌트 언마운트 시 타이머 해제
      clearTimeout(timeout);
    };
  }, [userStore.id, roomId, navigate, channelId]);

  // TODO : navigate 할 때 , 버튼 눌러서 갈건지 10초뒤에 보낼건지

  return (
    <div className="game-over-container">
      <h1 className="mb-4 text-2xl font-bold">게임 결과</h1>
      <p className="mb-4">{countdown}초 뒤에 대기실로 이동합니다</p>{' '}
      {/* 카운트다운 메시지 */}
      <div className="overflow-x-auto">
        <table className="reward-table min-w-full border">
          <thead className="">
            <tr>
              <th className="border-b px-8 py-2">Rank</th>
              <th className="border-b px-8 py-2">Nickname</th>
              <th className="border-b px-8 py-2">Score</th>
              <th className="border-b px-8 py-2">Level</th>
              <th className="border-b px-8 py-2">Points</th>
              <th className="border-b px-8 py-2">Current Exp</th>
            </tr>
          </thead>
          <tbody>
            {rewardData.map((player, index) => (
              <tr key={index} className="space-x-4">
                <td className="border-b px-8 py-2">{player.rank}</td>
                <td className="border-b px-8 py-2">{player.nickname}</td>
                <td className="border-b px-8 py-2">{player.score}</td>
                <td className="border-b px-8 py-2">{player.level}</td>
                <td className="border-b px-8 py-2">{player.point}</td>
                <td className="border-b px-8 py-2">{player.curExp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
