import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LobbyContent, LobbyHeader } from '.';

export function LobbyPage() {
  const { channelId } = useParams() as { channelId: string };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className={'h-screen w-screen'}>
      <LobbyHeader channelId={Number(channelId)} />
      <LobbyContent channelId={Number(channelId)} />
    </div>
  );
}
