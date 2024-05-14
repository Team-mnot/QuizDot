import { useLobbyQuery } from '../hooks/useLobbyQuery';
import { LobbyChattingBox, MyProfile, OnlineUserList, RoomList } from '.';
import { useContext, useEffect } from 'react';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

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
    <div className={'absolute left-[0px] top-[70px] flex w-full p-[20px]'}>
      {isLobbyError && (
        <div className="text-center">
          해당 채널의 로비를 불러올 수 없습니다.
        </div>
      )}
      {isLobbyLoading && <div className="text-center">Loading . . .</div>}
      {!isLobbyLoading && !lobby && (
        <div className="text-center">해당 채널의 로비가 존재하지 않습니다.</div>
      )}
      {!isLobbyLoading && lobby && lobby.channelId != -1 && (
        <div className={'w-full'}>
          <div className={'flex justify-between'}>
            <OnlineUserList activeUsers={lobby.activeUsers} />
            <RoomList roomInfos={lobby.roomInfos} channelId={lobby.channelId} />
          </div>
          <div className={'flex'}>
            <MyProfile />
            <LobbyChattingBox channelId={lobby.channelId} />
          </div>
        </div>
      )}
    </div>
  );
}
