import { startGameApi } from '@/shared/apis/commonApi';
import { Button } from '@/shared/ui';
export function MultiMatchBtn({
  roomId,
  mode,
  visible,
}: {
  roomId: number;
  mode: string;
  visible: boolean;
}) {
  const handleStartGame = async () => {
    const response = await startGameApi(roomId, mode);

    if (response != 200) console.error(`[${mode} 게임 입장 실패]`);
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
