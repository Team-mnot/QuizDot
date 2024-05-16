import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';
import { MultiMatchBtn, SurvivalMatchBtn } from '.';
import { useContext, useEffect } from 'react';
import { useGameStore } from '@/shared/stores/connectionStore/gameStore';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { MessageDto } from '@/shared/apis/types';
import { useUserStore } from '@/shared/stores/userStore/userStore';
export function RoomHeader({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  const { isReady, onSubscribeWithCallBack, onUnsubscribe } =
    useContext(WebSocketContext);
  const gameStore = useGameStore();

  const userStore = useUserStore();
  const callbackOfInfo = async (message: MessageDto) => {
    if (message.type === 'MODIFY') {
      gameStore.fetchRoom(message.data);
    }
  };

  useEffect(() => {
    onSubscribeWithCallBack(`info/room/${roomId}`, callbackOfInfo);

    return () => {
      onUnsubscribe(`info/room/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {}, [gameStore.roomInfo]);

  return (
    <div>
      {gameStore.roomInfo && (
        <div className="absolute left-[0px] top-[0px] w-full px-[50px] py-[20px]">
          <div className="flex justify-between">
            <RoomInfo roomInfo={gameStore.roomInfo} channelId={channelId} />
            <LeaveBtn roomId={roomId} channelId={channelId} />
          </div>

          <div className="text-center">
            <div className="flex justify-center">
              {gameStore.roomInfo.gameMode === 'NORMAL' ? (
                <MultiMatchBtn roomId={roomId} />
              ) : (
                <SurvivalMatchBtn
                  roomId={roomId}
                  category={gameStore.roomInfo.category}
                  visible={gameStore.roomInfo.hostId === userStore.id}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
