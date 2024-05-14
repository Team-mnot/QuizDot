import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';
import { RoomInfoType } from '@/pages/lobby/api/types';
import { WebSocketContext } from '@/shared/utils/WebSocketProvider';
import { useContext, useEffect, useState } from 'react';

export function RoomHeader(props: {
  channelId: number;
  roomInfo: RoomInfoType;
}) {
  const { callbackMsg } = useContext(WebSocketContext);
  const [roomInfo, setRoomInfo] = useState<RoomInfoType>(props.roomInfo);

  useEffect(() => {
    if (callbackMsg && callbackMsg.type == 'MODIFY') {
      setRoomInfo(callbackMsg.data as RoomInfoType);
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
    </div>
  );
}
