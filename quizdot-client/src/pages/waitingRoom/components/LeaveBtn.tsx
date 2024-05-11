import { Button } from '@/shared/ui';
import { LeaveRoomApi } from '../api/api';
import { useRouter } from '@/shared/hooks';

export function LeaveBtn({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  const router = useRouter();

  const leaveRoom = async () => {
    // 퇴장 하시겠냐고 한 번은 묻는 게 좋을까?
    const response = await LeaveRoomApi(roomId);
    if (response == 200) router.routeTo(`/${channelId}/lobby`);
    else console.log('실패');
  };

  return <Button className="w-[100px]" value="퇴장" onClick={leaveRoom} />;
}
