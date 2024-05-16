import { useRef } from 'react';
import { RoomContent, RoomHeader } from '.';

export function RoomFetchData(props: { channelId: number; roomId: number }) {
  const roomId = useRef<number>(props.roomId);
  const channelId = useRef<number>(props.channelId);

  return (
    <div>
      <RoomHeader roomId={roomId.current} channelId={channelId.current} />
      <RoomContent roomId={roomId.current} channelId={channelId.current} />
    </div>
  );
}
