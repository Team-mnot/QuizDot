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

  return (
    <div
      onClick={handleLeaveLobby}
      className="text-border custom-blinking custom-btn-transparent mr-4 flex cursor-pointer items-center text-stone-400"
    >
      채널 선택
    </div>
  );
}
