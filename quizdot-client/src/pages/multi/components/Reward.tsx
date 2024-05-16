import { Button, Progress } from '@/shared/ui';
import { RankType } from '../api/types';
import { useRouter } from '@/shared/hooks';
import { leaveRoomApi } from '@/pages/waitingRoom/api/api';
import { useContext, useEffect, useRef, useState } from 'react';
import { enterLobbyApi } from '@/pages/lobby/api/api';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useUserStore } from '@/shared/stores/userStore/userStore';
import { MessageDto } from '@/shared/apis/types';

export function Reward({
  ranks,
  roomId,
  channelId,
}: {
  ranks: RankType[];
  roomId: number;
  channelId: number;
}) {
  const router = useRouter();
  const secCount = useRef<number>(10);
  const [updateCount, setUpdateCount] = useState<number>(secCount.current);
  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);
  const userStore = useUserStore();
  const handleLeaveRoom = async () => {
    // 퇴장 하시겠냐고 한 번은 묻는 게 좋을까?
    const response = await leaveRoomApi(roomId);
    if (response == 200) {
      handleEnterLobby();
    } else console.log('[로비 입장 실패]');
  };

  const handleEnterLobby = async () => {
    const response = await enterLobbyApi(channelId);

    if (response.channelId != -1) {
      router.routeTo(`/${channelId}/lobby`);
    } else console.log('[로비 입장 실패]');
  };

  const handleReturnToRoom = () => {
    router.routeTo(`/${channelId}/${roomId}/waiting`);
  };

  useEffect(() => {
    onSubscribeWithCallBack(
      `info/game/${roomId}/title/${userStore.id}`,
      (message: MessageDto) => {
        console.log(message);
        if (message.type == 'TITLE') {
        }
      },
    );

    return () => {
      onUnsubscribe(`chat/room/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {
    const timer = setInterval(() => {
      setUpdateCount((prev) => {
        // 시간이 점차 감소함
        if (prev >= 1) {
          return prev - 1;
        } else {
          clearInterval(timer);

          return 0;
        }
      });
    }, 1000);

    handleReturnToRoom();
  }, []);

  return (
    <div>
      <Button
        className="w-[100px]"
        value={`${updateCount} 초 후 대기실로 이동`}
        onClick={handleReturnToRoom}
      />
      <Button
        className="w-[100px]"
        value={`로비로 이동`}
        onClick={handleLeaveRoom}
      />
      <div>
        <table>
          <tr className={'text-center'}>
            <td>
              <p>랭킹</p>
            </td>
            <td>
              <p>닉네임</p>
            </td>
            <td>
              <p>점수</p>
            </td>
            <td>
              <p>코인</p>
            </td>
            <td>
              <p>경험치</p>
            </td>
          </tr>

          {ranks &&
            ranks.map((rank) => (
              <tr className={'h-[50px] w-[500px] text-center'} key={rank.id}>
                <td>
                  <p>{rank.rank}</p>
                </td>
                <td>
                  <p>
                    Lv.{rank.curLevel} {rank.nickname}
                  </p>
                </td>
                <td>
                  <p>{rank.point}</p>
                </td>
                <td>
                  <p>{rank.point}</p>
                </td>
                <td>
                  <p>{rank.curExp}</p>
                </td>
                <td>
                  <Progress
                    color="yellow"
                    currentValue={5000}
                    maxValue={10000}
                    label={`${rank.curExp}/1000`}
                    padding=""
                    size="w-48"
                  />
                </td>
              </tr>
            ))}
        </table>
      </div>
    </div>
  );
}
