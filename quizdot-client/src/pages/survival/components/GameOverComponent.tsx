// src/pages/survival/components/GameOverComponent.tsx

import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
// import { enterRoomApi } from '@/pages/waitingRoom/api/api';
import { useUserStore } from '@/shared/stores/userStore/userStore';
// import jwtAxiosInstance from '@/shared/utils/jwtAxiosInstance';

export function GameOverComponent() {
  const navigate = useNavigate();
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const userStore = useUserStore();
  const originRoomId = Math.floor(parseInt(roomId) / 10000);

  // TODO : navigate 할 때 , 버튼 눌러서 갈건지 10초뒤에 보낼건지

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/${channelId}/${originRoomId}/waiting`);
    }, 5000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 해제
  }, [userStore.id, roomId, navigate, channelId, originRoomId]);

  return (
    <div className="game-over-container">
      <h1>게임 끝</h1>
    </div>
  );
}
