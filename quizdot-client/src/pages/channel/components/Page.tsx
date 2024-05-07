import { useEffect } from 'react';
import { Button } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { useChannelsQuery } from '../hooks/useChannelsQuery';

export function ChannelPage() {
  const navi = useNavigate();
  const {
    data: channels,
    isError: isChannelsError,
    isLoading: isChannelsLoading,
  } = useChannelsQuery();

  useEffect(() => {
    document.body.style.backgroundImage = 'url(/images/main_bg.png)';
    document.body.style.backgroundSize = 'cover';
  }, []);

  const clickChannel = (channel: number) => {
    navi(`/${channel}/lobby`, { replace: true });
  };

  return (
    <div
      className={
        'flex h-screen w-screen flex-col items-center justify-center text-center'
      }
    >
      <h1 className="p-5">채널</h1>
      {!isChannelsError && (
        <div>
          <div>Error 발생</div>
        </div>
      )}
      {!isChannelsLoading && (
        <div>
          {channels.map((item) => (
            <Button
              key={item.channelId}
              value={`${item.channelId} 채널<br>(${item.activeUserCount}/${item.totalAvailable})`}
              className="w-[150px]"
              onClick={() => clickChannel(item.channelId)}
              disabled={
                item.activeUserCount == item.totalAvailable ? true : false
              }
            />
          ))}
        </div>
      )}

      {/* <div className="flex w-[400px] justify-between px-2 py-5">
        <Button
          value={' 채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(1)}
        />
        <Button
          value={'2채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(2)}
        />
      </div>
      <div className="flex w-[400px] justify-between px-2 py-5">
        <Button
          value={'3채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(3)}
        />
        <Button
          value={'4채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(4)}
        />
      </div>
      <div className="flex w-[400px] justify-between px-2 py-5">
        <Button
          value={'5채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(5)}
        />
        <Button
          value={'6채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(6)}
        />
      </div>
      <div className="flex w-[400px] justify-between px-2 py-5">
        <Button
          value={'7채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(7)}
        />
        <Button
          value={'8채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(8)}
        />
      </div>
      <div className="flex w-[400px] justify-between px-2 py-5">
        <Button
          value={'9채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(9)}
        />
        <Button
          value={'10채널'}
          className="w-[150px]"
          onClick={() => handleClickChannel(10)}
        />
      </div> */}
    </div>
  );
}
