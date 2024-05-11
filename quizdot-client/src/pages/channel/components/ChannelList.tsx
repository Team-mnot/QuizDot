import { useRouter } from '@/shared/hooks';
import { ChannelInfosType } from '../api/types';
import { Channel } from '.';

export function ChannelList({ channel }: { channel: ChannelInfosType }) {
  const router = useRouter();

  const handleClickChannel = (channelId: number) => {
    router.routeTo(`/${channelId}/lobby`);
  };

  return (
    <div className="flex justify-center text-center">
      <div className="px-[20px]">
        {channel.channelInfos.map(
          (item, index) =>
            index % 2 === 0 && (
              <Channel
                key={item.channelId}
                channelInfo={item}
                handleClickChannel={handleClickChannel}
              />
            ),
        )}
      </div>
      <div className="px-[20px]">
        {channel.channelInfos.map(
          (item, index) =>
            index % 2 === 1 && (
              <Channel
                key={item.channelId}
                channelInfo={item}
                handleClickChannel={handleClickChannel}
              />
            ),
        )}
      </div>
    </div>
  );
}
