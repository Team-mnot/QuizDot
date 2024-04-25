//src/pages/survival/components/CharacterComponent.tsx
// 그냥 캐릭터 껍데기 입니다 여따가 더미 데이터 넣어서 출력하께요
// 더미 넣어서 출력하는거 CharacterPreview.tsx

import { CharacterProps } from '../api/types';

export function CharacterComponent({imageUrl, title, nickname, score}: CharacterProps) {
  return (
    <div>
      <img
        src={imageUrl}
        alt={nickname}
        className="mb-2 h-24 w-24" // 이미지 크기를 150x150 픽셀로 고정
      />
      <p>{title}</p>
      <p>{nickname}</p>
      <p>{score}</p>
    </div>
  );
}
