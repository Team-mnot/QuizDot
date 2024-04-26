// src/pages/survival/components/Page.tsx
import { useEffect } from 'react';
import { CharacterPreview } from './CharacterPreview';
import { ChattingBox } from './ChattingBox';

export function SurvivalPage() {
  useEffect(() => {
    // 페이지가 로드될 때 body의 스타일을 설정합니다.
    document.body.style.backgroundImage = 'url(/images/SurvivalBackground.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  return (
    <div className="relative z-10 p-4">
      <CharacterPreview />
      <ChattingBox/>
    </div>
  );
}
 