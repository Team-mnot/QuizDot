import { Button } from '@/shared/ui';
import { leaveRoomApi } from '../api/api';
import { useRouter } from '@/shared/hooks';
import { enterLobbyApi } from '@/pages/lobby/api/api';

export function LeaveBtn({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  const router = useRouter();

  const handleLeaveRoom = async () => {
    const confirmation = window.confirm('정말 방에서 나가시겠습니까?');
    if (confirmation) {
      const response = await leaveRoomApi(roomId);
      if (response == 200) {
        handleEnterLobby();
      } else console.log('[로비 입장 실패]');
    }
  };

  const handleEnterLobby = async () => {
    const response = await enterLobbyApi(channelId);

    if (response.channelId != -1) {
      router.routeTo(`/${channelId}/lobby`);
    } else console.log('[로비 입장 실패]');
  };

  return (
    <Button
      className="custom-pink custom-btn-transparent custom-text-outline-black"
      value="방 나가기"
      onClick={handleLeaveRoom}
    />
  );
}
