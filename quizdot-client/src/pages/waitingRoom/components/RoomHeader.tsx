import { RoomInfo } from './RoomInfo';
import { LeaveBtn } from './LeaveBtn';
import { RoomInfoDto } from '@/pages/lobby/api/types';

export function RoomHeader(props: {
  roomInfo: RoomInfoDto;
  channelId: string;
}) {
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
        <RoomInfo roomInfo={props.roomInfo}></RoomInfo>
      </div>
      <div>
        <LeaveBtn roomId={props.roomInfo.roomId} channelId={props.channelId} />
      </div>
    </div>
  );
}
