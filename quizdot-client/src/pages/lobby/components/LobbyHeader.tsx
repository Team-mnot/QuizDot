import { LeaveBtn } from './LeaveBtn';
import { LogOutButton } from '@/shared/components/index';

export function LobbyHeader({ channelId }: { channelId: number }) {
  return (
    <div className=" flex h-[70px] w-full justify-between">
      <div className="text-border min-w-[150px] pl-8 text-center text-[3em]">
        {channelId} 채널
      </div>
      <div className="flex">
        <LeaveBtn channelId={channelId} />
        <LogOutButton />
      </div>
    </div>
  );
}
