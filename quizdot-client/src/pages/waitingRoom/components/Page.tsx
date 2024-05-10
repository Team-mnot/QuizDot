/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { RoomHeader } from './RoomHeader';
import { useParams } from 'react-router-dom';
import { useEnterRoomQuery } from '../hooks/useEnterRoomQuery';
import { Character } from '@/shared/ui/Character';

export function WaitingRoomPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const {
    data: temp,
    isError: isTempError,
    isLoading: isTempLoading,
  } = useEnterRoomQuery(Number(roomId));

  // const playerKeys = Object.keys(temp.players);

  const [currentPeople, setCurrentPeople] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(8);

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
    setCurrentPeople(0);
    setMaxPeople(8);
  }, []);

  return (
    <div>
      {isTempError && <div>해당 게임의 정보를 불러올 수 없습니다.</div>}
      {isTempLoading && <div>Loading . . .</div>}
      {!isTempLoading && !temp && <div>해당 게임의 정보가 없습니다.</div>}
      {!isTempLoading && temp && temp.roomInfo.roomId != -1 && (
        <div>
          <RoomHeader roomInfo={temp.roomInfo} />
          <div>
            {channelId} 채널의 [{roomId}] 방
          </div>

          {currentPeople < maxPeople ? (
            <div>
              <p>매칭 시작</p>
              <div className="flex">
                <p>00:00</p>
                <p>취소</p>
              </div>
            </div>
          ) : (
            <div>
              <p>게임 시작</p>
            </div>
          )}
          <div>
            <p>유저 리스트</p>
            {temp.players &&
              Object.entries(temp.players).map(([key, player]) => (
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
      )}
    </div>
  );
}
