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
        className="w-[150px]"
        onClick={() => handleClickChannel(channelInfo.channelId)}
      />
      <div>
        ({channelInfo.activeUserCount}/{channelInfo.totalAvailable})
      </div>
    </div>
  );
}
