import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';

export function RoomHeader({
  channelId,
  roomId,
}: {
  channelId: number;
  roomId: number;
}) {
  return (
    <div className="absolute left-[0px] top-[0px] w-full px-[50px] py-[20px]">
      <div className="flex justify-between">
        <div>
          <RoomInfo channelId={channelId} />
        </div>
        <div>
          <LeaveBtn roomId={roomId} channelId={channelId} />
        </div>
      </div>
    </div>
  );
}
