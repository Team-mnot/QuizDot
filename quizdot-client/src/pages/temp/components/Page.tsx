/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { RoomHeader } from './RoomHeader';
import { useParams } from 'react-router-dom';
import { useRouter } from '@/shared/hooks';
import { useEnterRoomQuery } from '../hooks/useEnterRoomQuery';

export function TempPage() {
  const { channelId, roomId } = useParams() as {
    channelId: string;
    roomId: string;
  };

  const {
    data: temp,
    isError: isTempError,
    isLoading: isTempLoading,
  } = useEnterRoomQuery(Number(roomId));

  const playerKeys = Object.keys(temp.players);

  const router = useRouter();

  const [currentPeople, setCurrentPeople] = useState<number>(0);
  const [maxPeople, setMaxPeople] = useState<number>(8);

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/MultiBackground.png)';
    document.body.style.backgroundSize = 'cover';
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
            {playerKeys &&
              playerKeys.map((item) => <div key={item}>{item}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
