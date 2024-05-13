//src/pages/survival/components/QuizResultComponent.tsx

import { useEffect } from 'react';
import useQuizStore from '../store';
import { useQuiz2 } from '../hooks/useQuiz2';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { Button } from '@/shared/ui';

export function QuizResultComponent({ roomId }: { roomId: number }) {
  const { resultMessage, setShowResult, setShowCountDown } = useQuizStore();
  const { handleNextQuiz } = useQuiz2();
  const userStore = useUserStore();
  useEffect(() => {
    // handleNextQuiz();

    const timer = setTimeout(() => {
      // setTimeOut에는 실행할 함수, 지연시간 2개 넣습니다잉 n초뒤에 ShowResult를 false로 만들겠단 소리죠~
      setShowResult(false);
      //
      {
        roomInfo.hostId == userStore.id && (
          <Button
            value="초대 링크 생성"
            className="w-[110px] text-[10px] text-red-700"
            onClick={handleNextQuiz}
          />
        );
      }
      //

      setShowCountDown(true); // 카운트다운 페이지 가져와
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-4lx fixed left-0 right-0 top-10 mx-auto flex h-44 max-w-3xl items-center justify-center rounded-xl bg-white p-4">
      <div className="flex justify-center text-4xl">{resultMessage}</div>
    </div>
  );
}
