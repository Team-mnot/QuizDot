// src/pages/survival/components/CharacterWithPositionComponent.tsx
import { CharacterProps } from '../api/types';
import { CharacterComponent } from './CharacterComponent';

// `CharacterWithPositionProps` 타입에 `position` 프로퍼티를 추가해야 합니다.
interface CharacterWithPositionProps extends CharacterProps {
  position: {
    top: number;
    left: number;
  };
}

export function CharacterWithPositionComponent({
  imageUrl,
  title,
  nickname,
  // score,
  position,
}: CharacterWithPositionProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {/* 중복을 피하기 위해 CharacterComponent를 재사용합니다. */}
      <CharacterComponent
        imageUrl={imageUrl}
        title={title}
        nickname={nickname}
        // score={score}
      />
    </div>
  );
}
