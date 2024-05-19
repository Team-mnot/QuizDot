import { startGameApi } from '@/shared/apis/commonApi';
import { Button } from '@/shared/ui';

export function MultiMatchBtn({
  roomId,
  gameMode,
  visible,
}: {
  roomId: number;
  gameMode: string;
  visible: boolean;
}) {
  const handleStartGame = async () => {
    const response = await startGameApi(roomId, gameMode);
    response;
  };

  return (
    <div>
      {visible ? (
        <Button
          className="custom-pink custom-btn-transparent custom-text-outline-black custom-blinking text-[4em]"
          value="게임 시작"
          onClick={handleStartGame}
        />
      ) : (
        <div className="m-[100px] flex justify-center rounded-2xl bg-white bg-opacity-70 p-4 text-4xl text-red-700">
          호스트가 게임을 시작할때 까지 기다려주세요
        </div>
      )}
    </div>
  );
}
