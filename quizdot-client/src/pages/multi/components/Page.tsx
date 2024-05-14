import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { RoomFetchingData } from './RoomFetchingData';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';

export function MultiPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  // 로딩 때문에 깜빡거리는 문제 해결하기
  const { isReady, onSubscribe } = useContext(WebSocketContext);

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';

    onSubscribe(`chat/room/${roomId}`);
    onSubscribe(`info/room/${roomId}`);
    onSubscribe(`players/room/${roomId}`);
  }, [isReady]);

  return (
    <div>
      <RoomFetchingData channelId={Number(channelId)} roomId={Number(roomId)} />
    </div>
  );
}
