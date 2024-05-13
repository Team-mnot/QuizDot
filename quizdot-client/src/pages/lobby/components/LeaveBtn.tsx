import { Button } from '@/shared/ui';
import { useRouter } from '@/shared/hooks';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useContext } from 'react';

export function LeaveBtn({ channelId }: { channelId: number }) {
  const router = useRouter();
  const { onUnsubscribe } = useContext(WebSocketContext);

  const handleLeaveRoom = () => {
    onUnsubscribe(`chat/lobby/${channelId}`);
    router.routeTo('/channel');
  };

  return <Button value="로비로 이동" onClick={handleLeaveRoom} />;
}
