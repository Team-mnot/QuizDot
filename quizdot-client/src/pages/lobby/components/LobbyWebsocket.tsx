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

  console.log(lobby);
  return (
    <div>
      {isLobbyError && <div>해당 로비의 정보를 불러올 수 없습니다.</div>}
      {isLobbyLoading && <div>Loading . . .</div>}
      {!isLobbyLoading && !lobby && (
        <div>해당 로비의 정보가 존재하지 않습니다.</div>
      )}
      {!isLobbyLoading && lobby && lobby.channelId != -1 && (
        <div>
          <div className={'flex'}>
            <OnlineUserList activeUserDtos={lobby.activeUserDtos} />
            <RoomList
              roomInfoDtos={lobby.roomInfoDtos}
              channelId={lobby.channelId}
            />
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
