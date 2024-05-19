import { Players } from './Players';
import { QuizPreview } from './QuizPreview';

export function RoomContent() {
  return (
    <div className="absolute left-[0px] top-[70px] w-full p-[30px]">
      <Players />
      <QuizPreview />
    </div>
  );
}
