import { RoomInfoComponent } from './RoomInfoComponent';
import { ExitButtonComponent } from './ExitButtonComponent';
import { RoomInfoDto } from '@/pages/lobby/api/types';

interface RoomHeaderProps {
  roomInfo: RoomInfoDto;
}

export function RoomHeader(props: RoomHeaderProps) {
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
        <RoomInfoComponent roomInfo={props.roomInfo}></RoomInfoComponent>
      </div>
      <div>
        <ExitButtonComponent />
      </div>
    </div>
  );
}
