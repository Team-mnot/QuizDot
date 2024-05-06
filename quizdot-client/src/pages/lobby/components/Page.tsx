import { useEffect } from 'react';
import { OnlineUserList } from './OnlineUserList';
import { MyProfile } from './MyProfile';
import { RoomList } from './RoomList';

import { useParams } from 'react-router-dom';

import { SocketStore } from '@/shared/stores/socketStore/socket';
import { LobbyChattingBox } from './LobbyChattingBox';

export function LobbyPage() {
  const { channel } = useParams() as { channel: string };

  const stompInstance = new SocketStore();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <h1 className={'p-5'}>로비 ({channel} 채널)</h1>
      <div className={'flex'}>
        <OnlineUserList />
        <RoomList />
      </div>
      <div className={'flex'}>
        <MyProfile />
        <LobbyChattingBox stompInstance={stompInstance} channel={channel} />
      </div>
    </div>
  );
}
