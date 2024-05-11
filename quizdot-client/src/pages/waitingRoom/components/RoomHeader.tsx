import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';
import { RoomInfoType } from '@/pages/lobby/api/types';

export function RoomHeader({
  channelId,
  roomInfo,
}: {
  channelId: number;
  roomInfo: RoomInfoType;
}) {
  return (
    <div className="absolute left-[0px] top-[0px] flex w-full justify-between px-[50px] py-[20px]">
      <div>
        <RoomInfo roomInfo={roomInfo} channelId={channelId} />
      </div>
      <div>
        <LeaveBtn roomId={roomInfo.roomId} channelId={channelId} />
      </div>
    </div>
  );
}
