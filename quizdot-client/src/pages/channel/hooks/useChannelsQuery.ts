import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getChannelsApi } from '../api/api';
import { ChannelInfos } from '../api/types';

export function useChannelsQuery(): {
  data: ChannelInfos;
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: ChannelInfos = { channelInfos: [] };

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
