import { RoomInfoType } from '@/pages/lobby/api/types';

export function RoomInfo({
  channelId,
  roomInfo,
}: {
  channelId: number;
  roomInfo: RoomInfoType;
}) {
  return (
    <div>
      <div className="flex w-[700px]">
        <p>
          {channelId}&nbsp;채널&nbsp;[{roomInfo.title}]&nbsp;
        </p>
        <p>{roomInfo.open ? '공개' : '비공개'}&nbsp;|&nbsp;</p>
        <p>{roomInfo.gameMode}&nbsp;|&nbsp;</p>
        <p>{roomInfo.maxPeople}&nbsp;인&nbsp;|&nbsp;</p>
        <p>{roomInfo.category}&nbsp;|&nbsp;</p>
        <p>{roomInfo.maxQuestion}&nbsp;문제</p>
      </div>
    </div>
  );
}
