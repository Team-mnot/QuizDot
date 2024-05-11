import { SocketStore } from '@/shared/stores/connectionStore/socket';
import { LeaveBtn } from './LeaveBtn';
import { LogOutButton } from '@/shared/components/index';

export function LobbyHeader({
  channelId,
  stompInstance,
}: {
  channelId: number;
  stompInstance: SocketStore;
}) {
  console.log('[stompInstance] : ', stompInstance);

  return (
    <div className="absolute left-[0px] top-[0px] flex w-full justify-between px-[50px] py-[20px]">
      <div>
        <h1>{channelId} 채널</h1>
      </div>
      <div className="flex w-[250px] justify-between ">
        <LeaveBtn />
        <LogOutButton />
      </div>
    </div>
  );
}
