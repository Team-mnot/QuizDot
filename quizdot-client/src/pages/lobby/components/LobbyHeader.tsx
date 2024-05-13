import { LeaveBtn } from './LeaveBtn';
import { LogOutButton } from '@/shared/components/index';

export function LobbyHeader({ channelId }: { channelId: number }) {
  return (
    <div className="absolute left-[0px] top-[0px] flex w-full justify-between px-[50px] py-[20px]">
      <div>
        <h1>{channelId} 채널</h1>
      </div>
      <div className="flex w-[250px] justify-between ">
        <LeaveBtn channelId={channelId} />
        <LogOutButton />
      </div>
    </div>
  );
}
