import { LobbyChattingBox, MyProfile, OnlineUserList, RoomList } from '.';
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useLobbyQuery } from '../hooks/useLobbyQuery';

export function LobbyContent({ channelId }: { channelId: number }) {
  const navi = useNavigate();

  const {
    data: lobby,
    isError: isLobbyError,
    isLoading: isLobbyLoading,
  } = useLobbyQuery(Number(channelId));

  // 로딩 때문에 깜빡거리는 문제 해결하기
  const { isReady, onSubscribe, onUnsubscribe } = useContext(WebSocketContext);

  useEffect(() => {
    onSubscribe(`chat/lobby/${channelId}`);

    return () => {
      onUnsubscribe(`chat/lobby/${channelId}`);
    };
  }, [isReady]);

  useEffect(() => {
    if (isLobbyError) {
      const timer = setTimeout(() => {
        window.alert('로그인 페이지로 돌아갑니다');
        navi('/login/');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLobbyError, navi]);

  const Loading = () => {
    const [dots, setDots] = useState(1);

    useEffect(() => {
      const interval = setInterval(() => {
        setDots((prevDots) => (prevDots % 3) + 1);
      }, 500);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex h-full w-full items-center justify-center text-3xl">
        <div className="flex items-center justify-center rounded-2xl bg-white bg-opacity-70 p-6">
          Loading{'.'.repeat(dots)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full min-h-[500px] w-full">
      {isLobbyError && (
        <div className="flex h-full w-full flex-col items-center justify-center text-3xl">
          <div className="flex items-center justify-center rounded-2xl bg-white bg-opacity-70 p-6">
            해당 채널의 로비를 불러올 수 없습니다.
          </div>
        </div>
      )}
      {!isLobbyError && isLobbyLoading && (
        <div className="flex h-full w-full items-center justify-center text-3xl">
          <Loading />
        </div>
      )}
      {!isLobbyError && !isLobbyLoading && !lobby && (
        <div className="flex h-full w-full items-center justify-center text-3xl">
          <div className="flex items-center justify-center rounded-2xl bg-white bg-opacity-70 p-6">
            해당 채널의 로비가 존재하지 않습니다.
          </div>
        </div>
      )}
      {!isLobbyError && !isLobbyLoading && lobby && lobby.channelId != -1 && (
        <div className="w-full">
          <div className="flex h-[50%] w-full items-start justify-between">
            <OnlineUserList activeUsers={lobby.activeUsers} />
            <RoomList roomInfos={lobby.roomInfos} channelId={lobby.channelId} />
          </div>
          <div className="flex h-[50%] items-center pt-10">
            <MyProfile />
            <LobbyChattingBox channelId={lobby.channelId} />
          </div>
        </div>
      )}
    </div>
  );
}
