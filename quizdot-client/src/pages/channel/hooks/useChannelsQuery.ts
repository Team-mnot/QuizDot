import { useQuery } from '@tanstack/react-query';
import { getChannelsApi } from '../api/api';
import { channelInfo } from '../api/types';

export function useChannelsQuery(): {
  data: channelInfo[];
  isError: boolean;
  isLoading: boolean;
} {
  const fallback: channelInfo[] = [];

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
