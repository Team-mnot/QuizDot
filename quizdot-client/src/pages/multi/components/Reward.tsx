import { Button, Progress, Toast } from '@/shared/ui';
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
  const secCount = useRef<number>(20);
  const [updateCount, setUpdateCount] = useState<number>(secCount.current);

  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastState, setToastState] = useState<boolean>(false);
  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);
  const userStore = useUserStore();
  const handleLeaveRoom = async () => {
    const confirmation = window.confirm('정말 방에서 나가시겠습니까?');
    if (confirmation) {
      const response = await leaveRoomApi(roomId);
      if (response == 200) {
        handleEnterLobby();
      } else console.log('[로비 입장 실패]');
    }
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
        if (message.type == 'TITLE') {
          console.log(message);
          setToastMessage('새로운 칭호가 해금되었습니다!');
          setToastState(true);
        }
      },
    );

    return () => {
      onUnsubscribe(`info/game/${roomId}/title/${userStore.id}`);
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
          handleReturnToRoom();
          return 0;
        }
      });
    }, 1000);
  }, []);

  return (
    <div className="flex h-[550px] w-[720px] flex-col justify-between rounded-md border-r-2 bg-white p-4 py-5 shadow-md">
      <div className="text-center text-3xl">게임 결과</div>

      <div className="my-[10px] text-center text-lg">
        {updateCount} 초 후 대기실로 이동합니다
      </div>
      <hr className="mx-3 my-1 border-2 " />
      <div>
        <table>
          <tbody>
            <tr className={'text-center'}>
              <td className="w-[60px]">
                <p>랭킹</p>
              </td>
              <td className="w-[120px]">
                <p>레벨</p>
              </td>
              <td className="w-[180px]">
                <p>닉네임</p>
              </td>
              <td className="w-[80px]">
                <p>점수</p>
              </td>
              <td className="w-[80px]">
                <p>코인</p>
              </td>
              <td className="w-[80px]">
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
                      Lv.{rank.level}&nbsp;
                      {rank.curLevel != 0 && `(+${rank.curLevel})`}
                    </p>
                  </td>
                  <td>
                    <p>{rank.nickname}</p>
                  </td>
                  <td>
                    <p>{rank.score}</p>
                  </td>
                  <td>
                    <p>{rank.point}</p>
                  </td>
                  <td>
                    <td>
                      <Progress
                        color="yellow"
                        currentValue={rank.curExp}
                        maxValue={1000}
                        label={`${rank.curExp}/1000 +(${rank.point})`}
                        padding=""
                        size="w-48"
                      />
                    </td>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div className="flex justify-around">
          <Button
            className="w-[200px] hover:border-transparent hover:bg-gray-200 focus:outline-none
          active:bg-gray-300"
            value={'대기실로 이동'}
            onClick={handleReturnToRoom}
          />
          <Button
            className="w-[200px] hover:border-transparent hover:bg-gray-200 focus:outline-none
          active:bg-gray-300"
            value={`로비로 이동`}
            onClick={handleLeaveRoom}
          />
        </div>
      </div>

      {toastState === true ? (
        <Toast message={toastMessage} setToastState={setToastState} />
      ) : null}
    </div>
  );
}
