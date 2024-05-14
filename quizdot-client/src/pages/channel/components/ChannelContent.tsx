import { useChannelsQuery } from '../hooks/useChannelsQuery';
import { ChannelList } from '.';

export function ChannelContent() {
  const {
    data: channel,
    isError: isChannelError,
    isLoading: isChannelLoading,
  } = useChannelsQuery();

  return (
    <div className="absolute left-[0px] top-[150px] flex w-full justify-center p-[20px]">
      {isChannelError && (
        <div className="text-center">채널 목록을 불러올 수 없습니다.</div>
      )}
      {isChannelLoading && <div className="text-center">Loading . . .</div>}
      {!isChannelLoading && !channel && (
        <div className="text-center">채널 목록이 존재하지 않습니다.</div>
      )}
      {!isChannelLoading && channel && <ChannelList channel={channel} />}
    </div>
  );
}
