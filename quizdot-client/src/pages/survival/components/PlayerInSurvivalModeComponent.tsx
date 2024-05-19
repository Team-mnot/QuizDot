// src/pages/survival/components/PlayerInSurvivalModeComponent.tsx
import { PlayerType } from '@/shared/apis/types';
import Lottie from 'lottie-react';
import deadAnimation from '@/images/tomb.json'; // Lottie JSON 파일 경로

interface PlayerInSurvivalModeProps extends PlayerType {
  position: { top: number; left: number };
  isAlive: boolean;
  isRevive: boolean;
}

export function PlayerInSurvivalModeComponent({
  level,
  nickname,
  nicknameColor,
  title,
  characterId,
  position,
  isAlive,
  isRevive,
}: PlayerInSurvivalModeProps) {
  const displayCharacterId = isAlive ? characterId : 25;

  return (
    <div
      className="absolute"
      style={{
        top: `${position.top}%`,
        left: `${position.left}%`,
        transform: `translate(-50%, -50%)`,
        transformOrigin: 'center center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div className="relative">
        {isAlive ? (
          <img
            src={`/images/${displayCharacterId}.gif`}
            alt={nickname}
            className={'h-28 w-28 rounded-full object-cover'}
          />
        ) : (
          <Lottie
            animationData={deadAnimation}
            style={{ width: 80, height: 80 }}
          />
        )}
      </div>

      <div className="mt-2 flex flex-col items-center">
        <p
          className={
            'mb-1 rounded-lg border-2 border-solid border-black bg-white bg-opacity-80 px-2 text-xs text-red-500'
          }
        >
          {title}
        </p>
        <p
          style={{ color: nicknameColor }}
          className={
            'mb-1 rounded-lg border-2 border-solid border-black bg-white bg-opacity-80 px-2 text-xs font-bold'
          }
        >
          {nickname}
        </p>
        <div
          className={
            'rounded-lg border-2 border-solid border-black bg-white bg-opacity-80 px-2 text-xs'
          }
        >
          Level: {level}
        </div>
      </div>

      {isRevive && (
        <img
          src="/images/halo.png"
          alt="Revived"
          className={'h-30 absolute -top-0 -z-10 w-40'}
        />
      )}
    </div>
  );
}
