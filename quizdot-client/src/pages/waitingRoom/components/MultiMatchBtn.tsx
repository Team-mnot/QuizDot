import { startGameApi } from '@/shared/apis/commonApi';
import { Button } from '@/shared/ui';

export function MultiMatchBtn({
  roomId,
  visible,
}: {
  roomId: number;
  visible: boolean;
}) {
  const handleStartGame = async () => {
    const response = await startGameApi(roomId, 'NORMAL');
    response;
  };

  return (
    <div>
      {visible ? (
        <Button
          className="text-5xl"
          value="게임 시작"
          onClick={handleStartGame}
        />
      ) : (
        <div className="flex justify-center pt-10 text-3xl text-red-700 ">
          호스트가 게임을 시작할때 까지 기다려주세요
        </div>
      )}
    </div>
  );
}
