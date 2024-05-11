import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { SocketStore } from '@/shared/stores/connectionStore/socket';
import { LobbyContent, LobbyHeader } from '.';

export function LobbyPage() {
  const { channelId } = useParams() as { channelId: string };

  const stompInstance = useRef(new SocketStore());

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className={'h-screen w-screen'}>
      <LobbyHeader
        channelId={Number(channelId)}
        stompInstance={stompInstance.current}
      />
      <LobbyContent
        channelId={Number(channelId)}
        stompInstance={stompInstance.current}
      />
    </div>
  );
}
