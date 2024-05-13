import { startGameApi } from '@/shared/apis/commonApi';
import { useRouter } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useContext } from 'react';

export function MultiMatchBtn({
  channelId,
  roomId,
  mode,
}: {
  channelId: number;
  roomId: number;
  mode: string;
}) {
  const router = useRouter();

  const { onUnsubscribe } = useContext(WebSocketContext);

  const handleStartGame = async () => {
    const response = await startGameApi(roomId, mode);

    if (response == 200) {
      onUnsubscribe('');
      router.routeTo(`/${channelId}/${roomId}/${mode}`);

      // onSubscribe(`chat/room/${waitingRoom.roomInfo.roomId}`);
      // onSubscribe(`info/room/${waitingRoom.roomInfo.roomId}`);
      // onSubscribe(`players/room/${waitingRoom.roomInfo.roomId}`);
    } else console.log('[멀티 게임 입장 실패]');
  };

  return (
    <Button className="text-5xl" value="게임 시작" onClick={handleStartGame} />
  );
}
