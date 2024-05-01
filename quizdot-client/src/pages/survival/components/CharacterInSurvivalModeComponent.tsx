// src/pages/survival/components/CharacterWithPositionComponent.tsx
import { CharacterProps } from '../api/types';
import { CharacterComponent } from './CharacterComponent';

// `CharacterWithPositionProps` 타입에 `position` 프로퍼티를 추가해야 합니다.
interface CharacterInSurvivalModeProps extends CharacterProps {
  position: {
    top: number;
    left: number;
  };
  isAlive: boolean;
  isRevive: boolean;
}

export function CharacterInSurvivalModeComponent({
  imageUrl,
  title,
  nickname,
  position,
  isAlive,
  isRevive,
}: CharacterInSurvivalModeProps) {
  const characterImageUrl = isAlive ? imageUrl : '/images/deadBall.png';

  return (
    <div
      className="absolute"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: `translate(-50%, -50%) scale(1)`, // 수정: 중심을 기준으로 위치 조정 및 크기 조정
        transformOrigin: 'center center', // 추가: 변환의 기준점을 중앙으로 설정
      }}
    >
      {/* 중복을 피하기 위해 CharacterComponent를 재사용합니다. */}
      <div
        className="relative z-10" // characterImageUrl의 z-index를 설정합니다.
      >
        <CharacterComponent
          imageUrl={characterImageUrl}
          title={title}
          nickname={nickname}
        />
      </div>

      {/* 부활하면 머리에 링 씌워주려고요 ~ */}
      {isRevive && (
        <img
          src="/images/halo.png"
          alt="Revived"
          className={'h-30 w-30 absolute -top-5 z-0 '}
        />
      )}
    </div>
  );
}
