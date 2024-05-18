import { Button } from '@/shared/ui';
import { useRouter } from '@/shared/hooks';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useContext } from 'react';
import { leaveLobbyApi } from '../api/api';

export function LeaveBtn({ channelId }: { channelId: number }) {
  const router = useRouter();
  const { onUnsubscribe } = useContext(WebSocketContext);

  const handleLeaveLobby = async () => {
    onUnsubscribe(`chat/lobby/${channelId}`);
    const response = await leaveLobbyApi(channelId);
    if (response == 200) router.routeTo('/channel');
  };

  return <Button value="채널 선택" onClick={handleLeaveLobby} />;
}
