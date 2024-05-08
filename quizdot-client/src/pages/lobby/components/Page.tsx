import { useEffect } from 'react';

import { useParams } from 'react-router-dom';

import { SocketStore } from '@/shared/stores/connectionStore/socket';
import { LobbyWebsocket } from './LobbyWebsocket';

export function LobbyPage() {
  const { channelId } = useParams() as { channelId: string };

  const stompInstance = new SocketStore();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div>
      <h1 className={'p-5'}>로비 ({channelId} 채널)</h1>
      <LobbyWebsocket
        stompInstance={stompInstance}
        channelId={Number(channelId)}
      />
    </div>
  );
}
