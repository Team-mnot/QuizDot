import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';
import { RoomInfoType } from '@/pages/lobby/api/types';
import { MultiMatchBtn, SurvivalMatchBtn } from '.';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useContext, useEffect, useState } from 'react';
import { useUserStore } from '@/shared/stores/userStore/userStore';

export function RoomHeader(props: {
  channelId: number;
  roomInfo: RoomInfoType;
}) {
  const { callbackMsg } = useContext(WebSocketContext);
  const [roomInfo, setRoomInfo] = useState<RoomInfoType>(props.roomInfo);
  const userStore = useUserStore();
  useEffect(() => {
    if (
      callbackMsg.msg &&
      callbackMsg.address == `info/room/${roomInfo.roomId}` &&
      callbackMsg.msg.type == 'MODIFY'
    ) {
      setRoomInfo(callbackMsg.msg.data as RoomInfoType);
    }
  }, [roomInfo, callbackMsg]);

  return (
    <div className="absolute left-[0px] top-[0px] w-full px-[50px] py-[20px]">
      <div className="flex justify-between">
        <div>
          <RoomInfo roomInfo={roomInfo} channelId={props.channelId} />
        </div>
        <div>
          <LeaveBtn roomId={roomInfo.roomId} channelId={props.channelId} />
        </div>
      </div>
      <div>
        {roomInfo.hostId === userStore.id ? (
          <div className="flex justify-center">
            {roomInfo.gameMode === 'NORMAL' ? (
              <MultiMatchBtn
                channelId={props.channelId}
                roomId={roomInfo.roomId}
                mode={roomInfo.gameMode}
              />
            ) : (
              <SurvivalMatchBtn
                roomId={roomInfo.roomId}
                category={roomInfo.category}
              />
            )}
          </div>
        ) : (
          <div className=" flex justify-center pt-10 text-3xl text-red-700">
            호스트가 게임을 시작할때 까지 기다려주세요
          </div>
        )}
      </div>
    </div>
  );
}
