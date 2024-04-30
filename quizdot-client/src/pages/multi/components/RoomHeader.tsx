import { RoomInfoComponent } from './RoomInfoComponent';
import { ExitButtonComponent } from './ExitButtonComponent';

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
        <RoomInfoComponent
          title={dummyRoomInfo.title}
          public={dummyRoomInfo.public}
          password={dummyRoomInfo.password}
          mode={dummyRoomInfo.mode}
          maxPeople={dummyRoomInfo.maxPeople}
          category={dummyRoomInfo.category}
          maxQuestion={dummyRoomInfo.maxQuestion}
        ></RoomInfoComponent>
      </div>
      <div>
        <ExitButtonComponent />
      </div>
    </div>
  );
}
