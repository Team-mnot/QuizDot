import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getChannelsApi } from '../api/api';
import { ChannelInfosType } from '../api/types';

/*** 채널 목록 조회 Hook ***/
export function useChannelsQuery(): {
  data: ChannelInfosType;
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: ChannelInfosType = { channelInfos: [] };

  const {
    data = fallback,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['getChannels'],
    queryFn: () => getChannelsApi(),
    staleTime: 3000,
    gcTime: 3000,
    placeholderData: keepPreviousData,
  });

  return { data, isError, isLoading };
}
