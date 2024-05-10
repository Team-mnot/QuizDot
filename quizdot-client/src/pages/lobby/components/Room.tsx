import { RoomInfoDto } from '../api/types';

interface RoomProps {
  roomInfoDto: RoomInfoDto;
}

export function Room(props: RoomProps) {
  return (
    <div className={'w-[400px] rounded-lg border-2 bg-white p-5 shadow-md'}>
      <div className="flex justify-between">
        <p>{props.roomInfoDto.roomId}</p>
        <p>
          ({props.roomInfoDto.isPublic ? '공개' : '비공개'})
          {props.roomInfoDto.title}
        </p>
        <p>{props.roomInfoDto.gameMode}</p>
      </div>
      <div className="flex justify-between">
        <p>{props.roomInfoDto.category}</p>
        <p>{props.roomInfoDto.maxQuestion}</p>
        <p>{props.roomInfoDto.maxPeople}</p>
      </div>
    </div>
  );
}
