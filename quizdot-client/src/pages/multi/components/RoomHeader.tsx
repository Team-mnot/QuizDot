import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';

const dummyRoomInfo = {
  title: '익!',
  public: false,
  password: '1234',
  mode: 'multi',
  maxPeople: 5,
  category: '상식',
  maxQuestion: 20,
};

export function RoomHeader() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '0px',
        left: '0px',
      }}
      className={'flex w-full justify-between p-5'}
    >
      <div>
        <RoomInfo roomInfo={dummyRoomInfo}></RoomInfo>
      </div>
      <div>
        <LeaveBtn />
      </div>
    </div>
  );
}
