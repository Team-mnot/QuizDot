import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';

export function RoomHeader() {
  return (
    <div className="absolute left-[0px] top-[0px] w-full px-[50px] py-[20px]">
      <div className="flex justify-between">
        <div>
          <RoomInfo />
        </div>
        <div>
          <LeaveBtn />
        </div>
      </div>
    </div>
  );
}
