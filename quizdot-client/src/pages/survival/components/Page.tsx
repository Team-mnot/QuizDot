// src/pages/survival/components/Page.tsx

import { useEffect } from 'react';
import { fetchQuizData } from '../api/api';
import useQuizStore from '../store';

import { CharacterPreview } from './CharacterPreview';
import { ChattingBox } from '../../../shared/ui/ChattingBox';
import { ChattingBoxBlind } from '@/shared/ui/ChattingBoxBlind';
import { QuizComponent } from './QuizComponent';
import { QuizResultComponent } from './QuizResultComponent';
import { CountDown } from './CountDown';

export function SurvivalPage() {
  const { showChatBox, showResult, showCountDown, setQuizzes } = useQuizStore();
  const roomId = 8001;
  const category = 'RANDOM';
  const count = 2;

  useEffect(() => {
    // 페이지가 로드될 때 body의 스타일을 설정합니다.
    document.body.style.backgroundImage = 'url(/images/SurvivalBackground.png)';
    document.body.style.backgroundSize = 'cover';

    const loadData = async () => {
      try {
        const data = await fetchQuizData(roomId, category, count);
        setQuizzes(data.data.quizResList);
      } catch (error) {
        console.log('에러발생', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className={'flex h-full flex-col items-center justify-center'}>
      {showCountDown ? (
        <CountDown />
      ) : showResult ? (
        <QuizResultComponent />
      ) : (
        <QuizComponent roomId={roomId} />
      )}

      <CharacterPreview />

      {/* 조건부 렌더링 */}
      {showChatBox ? <ChattingBox /> : <ChattingBoxBlind />}
    </div>
  );
}
