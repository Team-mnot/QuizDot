import { Players } from './Players';
import { RoomChattingBox } from './RoomChattingBox';
import { QuizPreview } from './QuizPreview';
import { QuizSetType } from '../api/types';

export function RoomContent({
  quizSet,
  roomId,
  channelId,
}: {
  quizSet: QuizSetType[];
  roomId: number;
  channelId: number;
}) {
  return (
    <div className={'absolute left-[0px] top-[70px] w-full p-[30px]'}>
      <Players roomId={roomId} />
      <QuizPreview quizSet={quizSet} roomId={roomId} channelId={channelId} />
      <RoomChattingBox roomId={roomId} />
    </div>
  );
}
