import { useEffect } from 'react';
import { ChannelContent, ChannelHeader } from '.';

export function ChannelPage() {
  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/LobbyBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="w-screen h-screen">
      <ChannelHeader />
      <ChannelContent />
    </div>
  );
}
