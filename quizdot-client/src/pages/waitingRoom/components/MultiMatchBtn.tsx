import { startGameApi } from '@/shared/apis/commonApi';
import { Button } from '@/shared/ui';

export function MultiMatchBtn({ roomId }: { roomId: number }) {
  const handleStartGame = async () => {
    const response = await startGameApi(roomId, 'NORMAL');

    if (response != 200) console.error('[멀티 게임 입장 실패]');
  };

  return (
    <Button className="text-5xl" value="게임 시작" onClick={handleStartGame} />
  );
}
