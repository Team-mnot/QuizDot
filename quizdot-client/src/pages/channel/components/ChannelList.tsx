import { useRouter } from '@/shared/hooks';
import { ChannelInfosType } from '../api/types';
import { Channel } from '.';

export function ChannelList({ channel }: { channel: ChannelInfosType }) {
  const router = useRouter();

  const handleClickChannel = (channelId: number) => {
    router.routeTo(`/${channelId}/lobby`);
  };

  return (
    <div className="flex w-[500px] flex-wrap justify-center rounded-xl bg-white bg-opacity-50 p-6 text-center">
      {channel.channelInfos.map((item) => (
        <Channel
          key={item.channelId}
          channelInfo={item}
          handleClickChannel={handleClickChannel}
        />
      ))}
    </div>
  );
}
