import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LobbyContent, LobbyHeader } from '.';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

export function LobbyPage() {
  const { channelId } = useParams() as { channelId: string };

  // 로딩 때문에 깜빡거리는 문제 해결하기
  const { isReady, onSubscribe } = useContext(WebSocketContext);

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';

    onSubscribe(`chat/lobby/${channelId}`);
  }, [isReady]);

  return (
    <div className={'h-screen w-screen'}>
      <LobbyHeader channelId={Number(channelId)} />
      <LobbyContent channelId={Number(channelId)} />
    </div>
  );
}
