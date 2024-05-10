import { useEffect } from 'react';
import { Button } from '@/shared/ui';
import { useChannelsQuery } from '../hooks/useChannelsQuery';
import { useRouter } from '@/shared/hooks';

export function ChannelPage() {
  const router = useRouter();

  const {
    data: channels,
    isError: isChannelsError,
    isLoading: isChannelsLoading,
  } = useChannelsQuery();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  const moveToChannel = (channelId: number) => {
    router.routeTo(`/${channelId}/lobby`);
  };

  return (
    <div
      className={
        'flex h-screen w-screen flex-col items-center justify-center text-center'
      }
    >
      <h1 className="p-5">채널</h1>
      {isChannelsError && <div>채널 목록을 불러올 수 없습니다.</div>}
      {isChannelsLoading && <div>Loading . . .</div>}
      {!isChannelsLoading && !channels && (
        <div>채널 목록이 존재하지 않습니다.</div>
      )}
      {!isChannelsLoading &&
        channels &&
        channels.channelInfos.map((item) => (
          <div key={item.channelId}>
            <Button
              value={`${item.channelId} 채널 (${item.activeUserCount}/${item.totalAvailable})`}
              className="w-[150px]"
              onClick={() => moveToChannel(item.channelId)}
              disabled={
                item.activeUserCount == item.totalAvailable ? true : false
              }
            />
          </div>
        ))}
    </div>
  );
}
