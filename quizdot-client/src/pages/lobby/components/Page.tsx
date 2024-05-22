import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LobbyContent, LobbyHeader } from '.';

export function LobbyPage() {
  const { channelId } = useParams() as { channelId: string };

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/LobbyBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="h-full w-full overflow-hidden">
      <LobbyHeader channelId={Number(channelId)} />
      <LobbyContent channelId={Number(channelId)} />
    </div>
  );
}
