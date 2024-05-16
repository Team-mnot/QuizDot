import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LobbyContent, LobbyHeader } from '.';
import { useGameStore } from '@/shared/stores/connectionStore/gameStore';

export function LobbyPage() {
  const { channelId } = useParams() as { channelId: string };
  const gameStore = useGameStore();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';

    gameStore.reset();
  }, []);

  return (
    <div className={'h-screen w-screen'}>
      <LobbyHeader channelId={Number(channelId)} />
      <LobbyContent channelId={Number(channelId)} />
    </div>
  );
}
