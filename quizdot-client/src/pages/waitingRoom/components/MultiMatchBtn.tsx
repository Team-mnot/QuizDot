import { startGameApi } from '@/shared/apis/commonApi';
import { useRouter } from '@/shared/hooks';
import { Button } from '@/shared/ui';
import { modeList } from '../constants';

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

  const handleStartGame = async () => {
    const response = await startGameApi(roomId, mode);

    if (response == 200) {
      router.routeTo(`/${channelId}/${roomId}/${modeList[mode]}`);
    } else console.log('[멀티 게임 입장 실패]');
  };

  return (
    <Button className="text-5xl" value="게임 시작" onClick={handleStartGame} />
  );
}
