import { Button } from '@/shared/ui';

export function GameStartBtn() {
  const handleStartGame = async () => {};

  return (
    <Button className="text-5xl" value="게임 시작" onClick={handleStartGame} />
  );
}
