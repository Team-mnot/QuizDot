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
    <div className="absolute left-[0px] top-[0px] w-full px-[50px] py-[20px]">
      <div className="flex justify-between">
        <div>
          <RoomInfo roomInfo={roomInfo} channelId={channelId} />
        </div>
        <div>
          <LeaveBtn roomId={roomInfo.roomId} channelId={channelId} />
        </div>
      </div>
    </div>
  );
}
