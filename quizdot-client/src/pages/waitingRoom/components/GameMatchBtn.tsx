import { Button } from '@/shared/ui';
import { useEffect, useRef, useState } from 'react';

export function GameMatchBtn() {
  const handleMatchGame = async () => {};

  const handleCancelGame = async () => {};

  // 0 : 매칭 전, 1 : 매칭 중, 2 : 매칭 완료
  const matchStatus = useRef<number>(0);
  const [matchCount, setMatchCount] = useState<number>(0);

  useEffect(() => {
    // 5 분 이상이 되면 자동 매칭 취소
    setMatchCount(0);
    if (matchCount / 60 == 5) handleCancelGame();
  }, []);

  return (
    <div>
      {matchStatus.current == 0 && (
        <Button
          className="w-[300px] text-5xl"
          value="매칭 시작"
          onClick={handleMatchGame}
        />
      )}
      {matchStatus.current == 1 && (
        <div>
          <Button
            className="w-[300px] text-5xl"
            value="매칭 취소"
            onClick={handleCancelGame}
          />
          <p>
            {String(matchCount / 60).padStart(2, '0')}:
            {String(matchCount % 60).padStart(2, '0')}
          </p>
        </div>
      )}
      {matchStatus.current == 2 && (
        <div>
          <Button
            className="w-[300px] text-5xl"
            value="매칭 완료"
            onClick={() => {}}
          />
          <p>
            {String(matchCount / 60).padStart(2, '0')}:
            {String(matchCount % 60).padStart(2, '0')}
          </p>
        </div>
      )}
    </div>
  );
}
