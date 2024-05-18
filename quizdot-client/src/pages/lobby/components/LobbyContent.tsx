import { LobbyChattingBox, MyProfile, OnlineUserList, RoomList } from '.';
import { useContext, useEffect } from 'react';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useLobbyQuery } from '../hooks/useLobbyQuery';

export function LobbyContent({ channelId }: { channelId: number }) {
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

  return (
    <div className="flex h-full min-h-[500px] w-full">
      {isLobbyError && (
        <div className="flex h-full w-full items-center justify-center">
          해당 채널의 로비를 불러올 수 없습니다.
        </div>
      )}
      {!isLobbyError && isLobbyLoading && (
        <div className="flex h-full w-full items-center justify-center">
          Loading . . .
        </div>
      )}
      {!isLobbyError && !isLobbyLoading && !lobby && (
        <div className="flex h-full w-full items-center justify-center">
          해당 채널의 로비가 존재하지 않습니다.
        </div>
      )}
      {!isLobbyError && !isLobbyLoading && lobby && lobby.channelId != -1 && (
        <div className="w-full">
          <div className="flex h-[50%] w-full justify-center bg-black">
            <OnlineUserList activeUsers={lobby.activeUsers} />
            <RoomList roomInfos={lobby.roomInfos} channelId={lobby.channelId} />
          </div>
          <div className="flex h-[50%]">
            <MyProfile />
            <LobbyChattingBox channelId={lobby.channelId} />
          </div>
        </div>
      )}
    </div>
  );
}
