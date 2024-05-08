import { RoomInfo } from '../api/types';

interface RoomProps {
  roomInfo: RoomInfo;
}

export function Room(props: RoomProps) {
  return (
    <div className={'w-[400px] rounded-lg border-2 bg-white p-5 shadow-md'}>
      <div className="flex justify-between">
        <p>{props.roomInfo.roomId}</p>
        <p>
          ({props.roomInfo.public ? '공개' : '비공개'}) {props.roomInfo.title}
        </p>
        <p>{props.roomInfo.gameMode}</p>
      </div>
      <div className="flex justify-between">
        <p>{props.roomInfo.category}</p>
        <p>{props.roomInfo.maxQuestion}</p>
        <p>{props.roomInfo.maxPeople}</p>
      </div>
    </div>
  );
}
