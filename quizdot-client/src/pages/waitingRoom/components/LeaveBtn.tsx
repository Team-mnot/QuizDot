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
    // 퇴장 하시겠냐고 한 번은 묻는 게 좋을까?
    const response = await leaveRoomApi(roomId);
    if (response == 200) {
      handleEnterLobby();
    } else console.log('[로비 입장 실패]');
  };

  const handleEnterLobby = async () => {
    const response = await enterLobbyApi(channelId);

    if (response.channelId != -1) {
      router.routeTo(`/${channelId}/lobby`);
    } else console.log('[로비 입장 실패]');
  };

  return (
    <Button className="w-[100px]" value="퇴장" onClick={handleLeaveRoom} />
  );
}
