import { RoomInfoDto } from '@/pages/lobby/api/types';

interface RoomInfoProps {
  roomInfo: RoomInfoDto;
}

export function RoomInfoComponent(props: RoomInfoProps) {
  return (
    <div>
      <div className="flex">
        <p>[{props.roomInfo.title}]&nbsp;</p>
        <p>{props.roomInfo.isPublic ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.gameMode}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.category}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.maxQuestion}&nbsp;문제</p>
      </div>
      <div className="flex">
        <p>초대 코드&nbsp;:&nbsp;</p>
        <p>F123D</p>
      </div>
      <div className="flex">
        <p>인원 수&nbsp;:&nbsp;</p>
        <p>0</p>
      </div>
    </div>
  );
}
