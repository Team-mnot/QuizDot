import { useEffect } from 'react';
import { OnlineUserList } from './OnlineUserList';
import { MyProfile } from './MyProfile';
import { RoomList } from './RoomList';

import { useParams } from 'react-router-dom';

import { LobbyChattingBox } from './LobbyChattingBox';
import { useLobbyQuery } from '../hooks/useLobbyQuery';
import { SocketStore } from '@/shared/stores/connectionStore/socket';

export function LobbyPage() {
  const { channelId } = useParams() as { channelId: string };
  const {
    data: lobby,
    isError: isLobbyError,
    isLoading: isLobbyLoading,
  } = useLobbyQuery(Number(channelId));

  const stompInstance = new SocketStore();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <h1 className={'p-5'}>로비 ({lobby.channelId} 채널)</h1>
      {!isLobbyError && (
        <div>
          <div>로비 목록을 불러올 수 없습니다.</div>
        </div>
      )}
      {isLobbyLoading ? (
        <div>Loading . . .</div>
      ) : (
        <div>
          <div className={'flex'}>
            <OnlineUserList activeUsersInfo={lobby.activeUsersInfo} />
            <RoomList roomsInfo={lobby.roomsInfo} channelId={lobby.channelId} />
          </div>
          <div className={'flex'}>
            <MyProfile />
            <LobbyChattingBox
              stompInstance={stompInstance}
              channelId={lobby.channelId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
