import { Button } from '@/shared/ui';
import { useRouter } from '@/shared/hooks';
import { enterLobbyApi } from '@/pages/lobby/api/api';
import { leaveRoomApi } from '@/pages/waitingRoom/api/api';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';

export function LeaveBtn() {
  const router = useRouter();
  const roomStore = useRoomStore();

  const roomId = roomStore.roomInfo!.roomId;
  const channelId = Math.floor(roomStore.roomInfo!.roomId);

  const handleLeaveGame = async () => {
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
    <Button className="w-[100px]" value="퇴장" onClick={handleLeaveGame} />
  );
}
