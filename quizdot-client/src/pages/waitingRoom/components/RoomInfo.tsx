import { RoomInfoDto } from '@/pages/lobby/api/types';

export function RoomInfo(props: { roomInfo: RoomInfoDto }) {
  return (
    <div>
      <div className="flex">
        <p>[{props.roomInfo.title}]&nbsp;</p>
        <p>{props.roomInfo.open ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.gameMode}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.category}&nbsp;|&nbsp;</p>
        <p>{props.roomInfo.maxQuestion}&nbsp;문제</p>
      </div>
      <div className="flex">
        <p>초대 코드&nbsp;:&nbsp;</p>
        <p>{props.roomInfo.inviteLink ? props.roomInfo.inviteLink : '-'}</p>
      </div>
      <div className="flex">
        <p>인원 수&nbsp;:&nbsp;</p>
        <p>0</p>
      </div>
    </div>
  );
}
