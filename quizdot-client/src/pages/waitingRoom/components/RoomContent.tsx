import { useEffect, useState } from 'react';
import { Character } from '@/shared/ui/Character';
import { GameMatchBtn, GameStartBtn } from '.';

import { useUserStore } from '@/shared/stores/userStore/userStore';
import { EnteringRoomType } from '../api/types';

export function RoomContent({
  channelId,
  waitingRoom,
}: {
  channelId: number;
  waitingRoom: EnteringRoomType;
}) {
  // const playerKeys = Object.keys(temp.players);

  const userStore = useUserStore();

  const [currentPeople, setCurrentPeople] = useState<number>(
    Object.keys(waitingRoom.players).length,
  );

  console.log(channelId);

  useEffect(() => {
    setCurrentPeople;
    Object.keys(waitingRoom.players).length;
  }, []);

  return (
    <div className={'absolute left-[0px] top-[70px] w-full p-[30px]'}>
      <div className={'text-center'}>
        {userStore.id == waitingRoom.roomInfo.hostId &&
        currentPeople < waitingRoom.roomInfo.maxPeople ? (
          <GameMatchBtn />
        ) : (
          <GameStartBtn />
        )}
      </div>

      <div>
        {waitingRoom.players &&
          Object.entries(waitingRoom.players).map(([key, player]) => (
            <Character
              key={key}
              title={player.title}
              nickname={player.nickname}
              nicknameColor={player.nicknameColor}
              level={player.level}
              characterId={player.characterId}
            />
          ))}
      </div>
    </div>
  );
}
