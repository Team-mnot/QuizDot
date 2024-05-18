import { Players } from './Players';
import { QuizPreview } from './QuizPreview';

export function RoomContent({
  roomId,
  channelId,
}: {
  roomId: number;
  channelId: number;
}) {
  return (
    <div className={'absolute left-[0px] top-[70px] w-full p-[30px]'}>
      <Players roomId={roomId} />
      <QuizPreview roomId={roomId} channelId={channelId} />
    </div>
  );
}
