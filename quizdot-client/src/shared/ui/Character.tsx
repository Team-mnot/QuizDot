// src/shared/ui/CharacterComponent.tsx

import { PlayerType } from '@/pages/waitingRoom/api/types';

export function Character({
  nickname,
  nicknameColor,
  level,
  title,
  characterId,
}: PlayerType) {
  return (
    <div className={'m-2 flex w-36 flex-col items-center rounded-lg p-2'}>
      <img
        src={`/images/${characterId}.png`}
        alt={nickname}
        className={'mb-2 h-20 w-20 rounded-full object-cover'}
      />
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
  );
}
