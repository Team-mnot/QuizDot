// src/pages/survival/components/Page.tsx

import { useEffect } from 'react';
import { CharacterPreview } from './CharacterPreview';
import { ChattingBox } from '../../../shared/ui/ChattingBox';
import { ChattingBoxBlind } from '@/shared/ui/ChattingBoxBlind';
// import { QuizDummyComponent } from './QuizDummyComponent';
import { QuizComponent } from './QuizComponent';
import { QuizResultComponent } from './QuizResultComponent';

import useQuizStore from '../store';

export function SurvivalPage() {
  useEffect(() => {
    // 페이지가 로드될 때 body의 스타일을 설정합니다.
    document.body.style.backgroundImage = 'url(/images/SurvivalBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  const { showChatBox, showResult } = useQuizStore();
  const roomId = 8001;
  const category = 'RANDOM';
  const count = 2;
  console.log('서바이벌 페이지 출력 !');

  return (
    <div className={'flex h-full flex-col items-center justify-center'}>
      {/* <QuizDummyComponent /> */}

      {/* 걍 QuizComponent에 정답 입력 폼까지 같이 넣어버렸습니다 */}
      {showResult ? ( // store의 showResult가 true일 때 만 ! ! ! !
        <QuizResultComponent />
      ) : (
        <QuizComponent roomId={roomId} category={category} count={count} />
      )}

      {/* <QuizComponent roomId={roomId} category={category} count={count} /> */}

      <CharacterPreview />

      {/* 조건부 렌더링 */}
      {showChatBox ? <ChattingBox /> : <ChattingBoxBlind />}
    </div>
  );
}
