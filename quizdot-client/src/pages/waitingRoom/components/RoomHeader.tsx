import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';
import { MultiMatchBtn, SurvivalMatchBtn } from '.';
import { useContext, useEffect } from 'react';
import { useRoomStore } from '@/shared/stores/connectionStore/roomStore';
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
  const roomStore = useRoomStore();

  const userStore = useUserStore();
  const callbackOfInfo = async (message: MessageDto) => {
    if (message.type === 'MODIFY') {
      roomStore.fetchRoom(message.data);
    }
  };

  useEffect(() => {
    onSubscribeWithCallBack(`info/room/${roomId}`, callbackOfInfo);

    return () => {
      onUnsubscribe(`info/room/${roomId}`);
    };
  }, [isReady]);

  useEffect(() => {}, [roomStore.roomInfo]);

  return (
    <div>
      {roomStore.roomInfo && (
        <div
          className="absolute left-[0px] top-[0px] z-[2] w-full px-[50px] py-[20px]"
          style={{ zIndex: 1 }}
        >
          <div className="flex items-start justify-between">
            <RoomInfo roomInfo={roomStore.roomInfo} />
            <LeaveBtn roomId={roomId} channelId={channelId} />
          </div>

          <div className="flex justify-center text-center">
            <div className="flex justify-center" style={{ zIndex: 1 }}>
              {roomStore.roomInfo.gameMode === 'SURVIVAL' ? (
                <SurvivalMatchBtn
                  roomId={roomId}
                  category={roomStore.roomInfo.category}
                  visible={roomStore.roomInfo.hostId === userStore.id}
                />
              ) : (
                <MultiMatchBtn
                  roomId={roomId}
                  gameMode={roomStore.roomInfo.gameMode}
                  visible={roomStore.roomInfo.hostId === userStore.id}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
