import { Button } from '@/shared/ui';
import { ChannelInfoType } from '../api/types';

export function Channel({
  channelInfo,
  handleClickChannel,
}: {
  channelInfo: ChannelInfoType;
  handleClickChannel: (channelId: number) => void;
}) {
  return (
    <div className="p-[20px]">
      <Button
        value={`${channelInfo.channelId} 채널`}
        className="w-[150px] hover:border-transparent hover:bg-slate-400 hover:text-white focus:outline-none active:bg-slate-500"
        onClick={() => handleClickChannel(channelInfo.channelId)}
      />
      <div>
        ({channelInfo.activeUserCount}/{channelInfo.totalAvailable})
      </div>
    </div>
  );
}
