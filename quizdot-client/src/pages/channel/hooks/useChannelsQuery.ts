import { useQuery } from '@tanstack/react-query';
import { getChannelsApi } from '../api/api';
import { ChannelInfo } from '../api/types';

export function useChannelsQuery(): {
  data: ChannelInfo[];
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: ChannelInfo[] = [];

  const {
    data = fallback,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['getChannels'],
    queryFn: getChannelsApi,
  });

  return { data, isError, isLoading };
}
