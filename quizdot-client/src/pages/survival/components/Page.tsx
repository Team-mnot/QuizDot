// src/pages/survival/components/Page.tsx

import { useEffect } from 'react';
import { CharacterPreview } from './CharacterPreview';
import { ChattingBox } from '../../../shared/ui/ChattingBox';
import { QuizDummyComponent } from './QuizDummyComponent';
import { QuizComponent } from './QuizComponent';

export function SurvivalPage() {
  useEffect(() => {
    // 페이지가 로드될 때 body의 스타일을 설정합니다.
    document.body.style.backgroundImage = 'url(/images/genshin_background.jpg)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  const roomId = 8001;
  const category = 'RANDOM';
  const count = 1;


  
  return (
    <div className={'flex h-full flex-col items-center justify-center'}>
      {/* <QuizDummyComponent /> */}
      <QuizComponent roomId={roomId} category={category} count={count} />
      <CharacterPreview />
      <ChattingBox />
    </div>
  );
}
