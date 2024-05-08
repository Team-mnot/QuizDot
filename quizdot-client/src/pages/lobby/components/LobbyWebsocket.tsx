import { OnlineUserList } from './OnlineUserList';
import { MyProfile } from './MyProfile';
import { RoomList } from './RoomList';

import { LobbyChattingBox } from './LobbyChattingBox';
import { useLobbyQuery } from '../hooks/useLobbyQuery';
import { SocketStore } from '@/shared/stores/connectionStore/socket';

interface LobbyWebsocketProps {
  channelId: number;
  stompInstance: SocketStore;
}

export function LobbyWebsocket(props: LobbyWebsocketProps) {
  const {
    data: lobby,
    isError: isLobbyError,
    isLoading: isLobbyLoading,
  } = useLobbyQuery(props.channelId);

  return (
    <div>
      {isLobbyError && <div>해당 로비의 정보를 불러올 수 없습니다.</div>}
      {isLobbyLoading && <div>Loading . . .</div>}
      {!isLobbyLoading && !isLobbyError && (
        <div>
          <div>{lobby.channelId}</div>
          <div className={'flex'}>
            <OnlineUserList activeUsersInfo={lobby.activeUsersInfo} />
            <RoomList roomsInfo={lobby.roomsInfo} channelId={lobby.channelId} />
          </div>
          <div className={'flex'}>
            <MyProfile />
            <LobbyChattingBox
              stompInstance={props.stompInstance}
              channelId={lobby.channelId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
